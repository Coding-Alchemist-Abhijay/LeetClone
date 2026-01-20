import {NextResponse} from "next/server";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import {redis} from "@/lib/redis";
import {db} from "@/lib/db";

export async function GET(req) {
    try {
        const cookie = req.cookies.get("session_id");
        const sessionId = await redis.get(cookie.value);
        await redis.del(cookie.value);
        const user = await db.user.findUnique({
            where: { id: sessionId.id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return NextResponse.json(
            new ApiResponse(
                200, 
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                "User logged out successfully"
            ),
            { status: 200 }
        ).cookie.del("session_id");
    } catch (error) {
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