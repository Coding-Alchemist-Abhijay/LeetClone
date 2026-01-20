import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validations/auth.schema";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import { redis } from "@/lib/redis";
import { sendEmail, emailVerificationMailgenContent } from "@/app/utils/mail";

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

export async function POST(req) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        new ApiError(
          400,
          null,
          result.error.flatten().fieldErrors,
        ),
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        new ApiError(409, null, "Email already exists"),
        { status: 409 }
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .scryptSync(password, salt, 64)
      .toString("hex");

    const newUser = await db.user.create({
      data: {
        name: name,
        email,
        password: hashedPassword,
        salt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    const Session_Id = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.randomBytes(32).toString('hex');
    await redis.set(
      Session_Id,
      { id: newUser.id, email: newUser.email },
      { ex: 60 * 60 * 24 * 7 } 
    );

    await sendEmail({
      email: newUser?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        newUser.name,
        `${new URL(`/api/users/verify-email/${hashedToken}`, req.url)}`,
      ),
    });

    await redis.set(
      hashedToken,
      { id: newUser.id },
      { ex: 60 * 60 * 24 * 7 } 
    );

    const response =  NextResponse.json(
      new ApiResponse(
        201,
        {
          id: newUser.id,
          email: newUser.email,
        },
        "Email verification required please check your email"
      ),
      { status: 201 }
    );

    response.cookies.set({
      name: "session_id",
      value: Session_Id,
      httpOnly: true,
      path: "/",
      sameSite : "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      new ApiError(
        500,
        null,
        error?.message || "Internal Server Error"
      ),
      { status: 500 }
    );
  }
}
