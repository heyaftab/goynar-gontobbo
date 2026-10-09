import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyGoogleIdToken } from "@/lib/auth/google";

export const runtime = "nodejs";
const cookieName = "gg_google_session";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const token = (await cookies()).get(cookieName)?.value;
  if (!clientId || !token) return NextResponse.json({ user: null });

  try {
    const claims = await verifyGoogleIdToken(token, clientId);
    if (!claims) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: { name: claims.name, email: claims.email } });
  } catch {
    return NextResponse.json({ user: null }, { status: 503 });
  }
}
