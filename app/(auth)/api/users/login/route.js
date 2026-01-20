import {NextResponse} from "next/server";
import { db } from "@/lib/db";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import crypto from "crypto";
import {redis} from "@/lib/redis";

export async function GET(req) {
    try {
      const cookie = req.cookies.get("session_id")?.value;
      if (cookie) {
        const user = await redis.get(cookie);
        if (user) {
          const dbUser = await db.user.findUnique({
            where: {
              id: user.id,
            },
          });
          if (dbUser && dbUser.isEmailVerified) {
            return new Response(null, { status: 200 });
          }
        }
      }
      return new Response(null, { status: 204 });
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        new ApiError(500, null, error?.message || "Internal Server Error"),
        { status: 500 }
      );
    }
  }

export const POST = async (req) => {
    let User = null;
    try {
            const {credentials, password, remember} = await req.json();
        if (typeof credentials === 'string' && credentials.includes('@')) {
            const user = await db.user.findUnique({
                where: {
                    email: credentials,
                }
            });
            if(!user) return NextResponse.json(new ApiError(401, null , "Invalid Email"), {status: 401})
            const salt = user.salt;
            const inptpassword = user.password;
            const hashedPassword = crypto
                .scryptSync(password, salt, 64)
                .toString("hex");
            if(inptpassword == hashedPassword) User = user;
            else return NextResponse.json(new ApiError(401, null , "Invalid Password"), {status: 401})
        }
        else { 
            const users = await db.user.findMany({
                where: {
                    name: credentials,
                }
            });
            let foundUser = null;

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const salt = user.salt;
                const storedPassword = user.password;
                const hashedPassword = crypto
                    .scryptSync(password, salt, 64)
                    .toString("hex");
                if (storedPassword === hashedPassword) {
                    foundUser = user;
                    break;
                }
            }

            if (!foundUser) {
                return NextResponse.json(new ApiError(401, null , "Invalid Username or Password"), {status: 401});
            }
            User = foundUser;
        }
        if(!User.isEmailVerified) return NextResponse.json(new ApiError(401, null , "Email not verified"), {status: 401});
        const sessionId = crypto.randomBytes(32).toString('hex');
        if(remember) await redis.set(sessionId, {id : User.id}, {ex : 24 * 60 * 60 * 7});
        else await redis.set(sessionId, {id : User.id}, {ex : 24 * 60 * 60});
        const res = NextResponse.json(new ApiResponse(200, User, "Sign In Successful"));
        if(remember)
            res.cookies.set({
            name : "session_id", 
            value : sessionId, 
            httpOnly: true,
            path: "/",
            sameSite : "lax",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production"
         });
         else {
            res.cookies.set({
            name : "session_id", 
            value : sessionId, 
            httpOnly: true,
            path: "/",
            sameSite : "lax",
            maxAge: 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production"
         });    
         }
    return res;

    } catch(error) {
        return NextResponse.json(new ApiError(500, null , error?.message || "Internal Server Error"), {status: 500})
    }
}