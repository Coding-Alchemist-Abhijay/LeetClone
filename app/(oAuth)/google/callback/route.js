import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {google} from "@/lib/oauth/google";
import {decodeIdToken} from "arctic";
import crypto from "crypto"
import {redis} from "@/lib/redis";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const OAuth_state = req.cookies.get("oAuth_state")?.value;
        const oAuth_codeVerifier = req.cookies.get("oAuth_codeVerifier")?.value;
        if(!code || !state || !oAuth_codeVerifier || !OAuth_state || state !== OAuth_state) {
            return NextResponse.redirect("http://localhost:3000/login");
        }
        let tokens;
        try {
            tokens = await google.validateAuthorizationCode(code, oAuth_codeVerifier);
        } catch (error) {
            console.log(error);
            return NextResponse.redirect("http://localhost:3000/login");
        }
        const claims = decodeIdToken(tokens.data.id_token);
        const {sub : googleUserId, name, email} = claims;
    
    
    let user = await db.user.findUnique({
        where: { email },
        include: { oauthAccounts: true }
    });
    
    let oauthAccount = user 
        ? user.oauthAccounts.find(
            acc => acc.provider === 'google' && acc.providerAccountId === googleUserId
          )
        : null;
    
    if (user) {
        if (!oauthAccount) {
            // Case 1: user signed up using traditional method, now logging in via Google
            // Attach Google OAuth account to this user if not already present
            await db.oAuthAccount.create({
                data: {
                    // This "connect" statement tells Prisma to link (associate) this new OAuthAccount record
                    // to an existing user with the given user.id, instead of creating a new user.
                    user: { connect: { id: user.id } },
                    provider: 'google',
                    providerAccountId: googleUserId
                }
            });
        }
        // else case -- 2 --> User Signed in via google and is again signing in via google
    } else {
        // Case 3: user does not exist, create user and oAuthAccount
        user = await db.user.create({
            data: {
                name,
                email,
                password: '',      // As no password for oAuth users
                salt: '',          // No salt for oAuth user
                isEmailVerified: true, // Since Google verified email
                oauthAccounts: {
                    create: {
                        provider: 'google',
                        providerAccountId: googleUserId
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
