import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";
import crypto from 'crypto'

export async function GET(request) {
    try{
        const name = process.env.ADMIN_NAME;
        const password = process.env.ADMIN_PASSWORD;
        const users = await db.user.findMany({
            where : {
                name : name,
            },
            select: {
                problems: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        tags: true,
                        solvedBy: true,
                    }
                },
                salt : true, 
                password : true,
            }
        })
        let User = null;
        for(let i=0;i<users.length;i++) {
            const user = users[i];
            const salt = user.salt;
            const storedPassword = user.password;
            const hashedPassword = crypto
                .scryptSync(password, salt, 64)
                .toString("hex");
            if (storedPassword === hashedPassword) {
                User = user;
                break;
            }
        }
        return NextResponse.json(new ApiResponse(200, User.problems, "Problems fetched successfully"));
    } catch(error) {
        console.log(error)
        return NextResponse.json(new ApiError(500, null ,error.message));
    }
}