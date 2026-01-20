import { ApiError } from "@/app/utils/ApiError";
import {NextResponse} from "next/server"
import {redis} from '@/lib/redis'
import {db} from "@/lib/db"

export async function GET(req, { params }) {
    try {
    const { token } = await params;
    
    if (!token) {
        return NextResponse.json(
            new ApiError(400, null, "Missing verification token"), 
            { status: 400 }
        );
    }
    
    const session_id = req.cookies.get("session_id");
    if(!session_id) return NextResponse.json(new ApiError(401, null, "Unauthorized"), {status: 401});
    
    const user = await redis.get(token);
    if(!user) {
        return NextResponse.json(new ApiError(401, null, "Token Expired Please try again"), {status: 401});
    }
    await redis.del(token);
    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            isEmailVerified: true,
        },
    });
    return NextResponse.redirect(new URL("/", req.url)); 
    } catch(error) {
        return NextResponse.json(new ApiError(500, null, error?.message || "Internal Server Error"), {status: 500});
    }
}