import {db} from '@/lib/db';
import {redis} from "@/lib/redis";
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
    try {
    const {problemId} = params;
    const cookie = req.cookies.get("session_id")?.value;
    const dbUser = await redis.get(cookie);
    const submissions = await db.submission.findMany({
        where:{
          problemId:problemId,
          userId:dbUser.id
        }
      })
       return NextResponse.json({ success: true, data: submissions }, {statusCode : 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, {statusCode : 500});
    }
}