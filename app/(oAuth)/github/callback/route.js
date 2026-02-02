import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {github} from "@/lib/oauth/github";
import {decodeIdToken} from "arctic";
import crypto from "crypto"
import {redis} from "@/lib/redis";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const OAuth_state = req.cookies.get("oAuth_state")?.value;
        if(!code || !state || !OAuth_state || state !== OAuth_state) {
            return NextResponse.redirect("http://localhost:3000/login");
        }
        let tokens;
        try {
            tokens = await github.validateAuthorizationCode(code);
        } catch (error) {
            console.log(error);
            return NextResponse.redirect("http://localhost:3000/login");
        }
        console.log(tokens);
        const githubResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${tokens.data.access_token}`
            }
        });
        if(!githubResponse.ok) return NextResponse.redirect("http://localhost:3000/login");
        const githubData = await githubResponse.json();
        const { id: githubUserId, name, login } = githubData;

        const safeName = name ?? login ?? email.split('@')[0];    

        const githubUserResponse = await fetch('https://api.github.com/user/emails', {
            headers : {
                Authorization : `Bearer ${tokens.data.access_token}`
            }
        });
        if(!githubUserResponse) return NextResponse.redirect("http://localhost:3000/login");
        const githubUserData = await githubUserResponse.json();
        console.log(githubUserData);
        const email = githubUserData.filter((e) => e.primary)[0].email;
        if(!email) return NextResponse.redirect("http://localhost:3000/login");

    
    let user = await db.user.findUnique({
        where: { email },
        include: { oauthAccounts: true }
    });
    
    let oauthAccount = user 
        ? user.oauthAccounts.find(
            acc => acc.provider === 'github' && acc.providerAccountId === githubUserId.toString()
          )
        : null;
    
    if (user) {
        if (!oauthAccount) {
            // Case 1: user signed up using traditional method, now logging in via github
            // Attach github OAuth account to this user if not already present
            await db.oAuthAccount.create({
                data: {
                    // This "connect" statement tells Prisma to link (associate) this new OAuthAccount record
                    // to an existing user with the given user.id, instead of creating a new user.
                    user: { connect: { id: user.id } },
                    provider: 'github',
                    providerAccountId: githubUserId.toString(),
                }
            });
        }
        // else case -- 2 --> User Signed in via github and is again signing in via github
    } else {
        // Case 3: user does not exist, create user and oAuthAccount
        user = await db.user.create({
            data: {
                name : safeName,
                email,
                password: '',      // As no password for oAuth users
                salt: '',          // No salt for oAuth user
                isEmailVerified: true, // Since github verified email
                oauthAccounts: {
                    create: {
                        provider: 'github',
                        providerAccountId: githubUserId.toString()
                    }
                }
            }
        });
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    await redis.set(sessionId, {id : user.id}, {ex : 24 * 60 * 60 * 7});
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;      
    } catch(error) {
        console.log(error);
        return NextResponse.redirect("http://localhost:3000/login");
    }
}
