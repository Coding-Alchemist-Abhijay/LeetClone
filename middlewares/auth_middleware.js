import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const PUBLIC_PATHS = ["/login", "/signup"];

export async function authMiddleware(req) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) {
    return null;
  }
  if (pathname.startsWith("/_next")) {
    return NextResponse.next()
  }
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  const sessionId = req.cookies.get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const session = await redis.get(sessionId);

  if (!session) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("session_id");
    return res;
  }

  return null;
}
