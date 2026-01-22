import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    return NextResponse.json({ loggedIn: true });
  } else {
    return NextResponse.json({ loggedIn: false });
  }
}