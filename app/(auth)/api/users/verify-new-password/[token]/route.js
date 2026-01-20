import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { signupSchema } from "@/lib/validations/auth.schema";

export async function POST(req, { params }) {
    try {
        const { password, repassword } = await req.json();
        if (password !== repassword) {
            return NextResponse.json(
                new ApiError(400, null, "Passwords do not match"),
                { status: 400 }
            );
        }

        const passwordValidation = signupSchema.pick({ password: true }).safeParse({ password });
        if (!passwordValidation.success) {
            const errors = passwordValidation.error.flatten().fieldErrors.password || [];
            return NextResponse.json(
                new ApiError(
                    400,
                    errors.join("; ") || "Password validation failed",
                    errors
                ),
                { status: 400 }
            );
        }

        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                new ApiError(400, null, "Missing verification token"),
                { status: 400 }
            );
        }

        const user = await redis.get(token);
        if (!user) {
            return NextResponse.json(
                new ApiError(401, null, "Token Expired Please try again"),
                { status: 401 }
            );
        }
        const dbUser = await db.user.findUnique({
            where: {
                id: user.id,
            },
        });
        const salt = dbUser.salt;
        const hashedPassword = crypto
            .scryptSync(password, salt, 64)
            .toString("hex");
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        await redis.del(token);
        return NextResponse.json(
            new ApiResponse(200, null, "Password reset successful"),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        // zod errors
        if (error && error.errors) {
            return NextResponse.json(
                new ApiError(400, "Validation error", error.errors),
                { status: 400 }
            );
        }
        return NextResponse.json(
            new ApiError(500, error?.message || "Internal Server Error", null),
            { status: 500 }
        );
    }
}
