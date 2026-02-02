import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/auth_middleware";

export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
  };

export async function middleware(req) {
  const authResult = await authMiddleware(req);
  if (authResult) return authResult;
  return NextResponse.next();
}
