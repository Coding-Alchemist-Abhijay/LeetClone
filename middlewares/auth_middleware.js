import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const PUBLIC_PATHS = ["/login", "/signup", "/"];

export async function authMiddleware(req) {
  const sessionId = req.cookies.get("session_id")?.value;
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.origin;
  if(pathname == '/') return NextResponse.next();
  if (pathname === '/login/forgot-password' || pathname.startsWith('/passwordReset')) return NextResponse.next();
  if (PUBLIC_PATHS.includes(pathname)) {
      const cookieHeader = req.headers.get("cookie") ?? "";
      if(sessionId) {
        const res = await fetch(`${url}/api/users${pathname}`, {
          method: "GET",
          headers: {
            cookie: cookieHeader, 
          },
        })
        if(res.status === 200) return NextResponse.redirect(new URL("/", req.url));
        else return NextResponse.next();
      }
      return NextResponse.next();
  }
  if (pathname.startsWith("/_next")) {
    return NextResponse.next()
  }
  if (pathname.startsWith("/api") || pathname.startsWith("/google") || pathname.startsWith("/github")) {
    return NextResponse.next();
  }

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
