import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const sessionRaw = await redis.get(sessionId);
  if (!sessionRaw) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const session =
    typeof sessionRaw === "string"
      ? JSON.parse(sessionRaw)
      : sessionRaw;

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl : true,
    },
  });

  return NextResponse.json({ user });
}
