import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params; 
    const problem = await db.problem.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        examples: true,
        constraints: true,
        codeSnippets: true,
        editorial: true,
        hints: true,
        testCases: true,
        difficulty: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        userId: true,
        referenceSolutions: true,
        user: true,
        solvedBy: true,
      },
    });

    return NextResponse.json({ success: true, data: problem });
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}
