import { NextResponse } from "next/server";
import {db} from "@/lib/db"
import { ApiError } from "@/app/utils/ApiError";
import { ApiResponse } from "@/app/utils/ApiResponse";

export async function POST(request) {
    try {
        const body = await request.json();
        const {id} = body;
        if (!id) {
            return NextResponse.json(
                new ApiResponse(400, null, "Problem id is required"),
                { status: 400 }
            );
        }

        const problem = await db.problem.findUnique({ where: { id } });

        if (!problem) {
            return NextResponse.json(
                new ApiResponse(404, null, "Problem not found"),
                { status: 404 }
            );
        }

        await db.problem.delete({ where: { id } });

        return NextResponse.json(
            new ApiResponse(200, null, "Problem deleted successfully"),
            { status: 200 }
        );
    } catch(error) {
        console.log(error)
        return NextResponse.json(new ApiError(500, null, error.message));
    }
}