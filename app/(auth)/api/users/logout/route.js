import {NextResponse} from "next/server";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import {redis} from "@/lib/redis";

export async function GET(req) {
    try {
        const cookie = req.cookies.get("session_id");
        
        if (!cookie) {
            return NextResponse.json(
                new ApiError(400, null, "No session found"),
                { status: 400 }
            );
        }
        
        const sessionId = await redis.get(cookie.value);
        
        if (sessionId) {
            await redis.del(cookie.value);
        }
        
        const response = NextResponse.json(
            new ApiResponse(
                200, 
                null,
                "User logged out successfully"
            ),
            { status: 200 }
        );
        response.cookies.set({
            name: "session_id",
            value: "",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            maxAge: 0,
            secure: process.env.NODE_ENV === "production"
        });
        
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            new ApiError(
                500,
                error?.message || "Internal Server Error",
                null
            ),
            { status: 500 }
        );
    }
}