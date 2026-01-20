import {NextResponse} from "next/server";
import { db } from "@/lib/db";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import  crypto  from "crypto"
import {redis} from "@/lib/redis"
import {sendEmail, forgotPasswordMailgenContent} from '@/app/utils/mail'

export const POST = async (req) => {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        new ApiError(400, null, "Valid email is required"),
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        new ApiResponse(200, null, "If this email exists in our system, you will receive a password reset link."),
        { status: 200 }
      );
    }

    const unHashedToken = crypto.randomBytes(32).toString("hex");

    await redis.set(
      unHashedToken,
      {id : user.id},
      {ex : 60 * 60}
    );

    await sendEmail({
      email: email,
      subject: "Password reset request",
      mailgenContent: forgotPasswordMailgenContent(
        user.name,
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
      ),
    });

    return NextResponse.json(
      new ApiResponse(200, null, "If this email exists in our system, you will receive a password reset link."),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      new ApiError(500, null, error?.message || "Internal Server Error"),
      { status: 500 }
    );
  }
};

