import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function currentUserRole() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) return null;
  const sessionRaw = await redis.get(sessionId);
  if (!sessionRaw) return null;
  const session =
    typeof sessionRaw === "string" ? JSON.parse(sessionRaw) : sessionRaw;

  if (!session?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { role: true },
  });
  return user ? user.role : null;
}
