import { NextRequest, NextResponse } from "next/server";
import { verifyGoogleIdToken } from "@/lib/auth/google";
import { isAllowedOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Request origin is invalid." }, { status: 403 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.json({ message: "Google autofill is not configured." }, { status: 503 });

  let body: { credential?: unknown };
  try {
    body = await request.json() as { credential?: unknown };
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (typeof body.credential !== "string" || body.credential.length > 12000) {
    return NextResponse.json({ message: "Google credential is invalid." }, { status: 422 });
  }

  try {
    const claims = await verifyGoogleIdToken(body.credential, clientId);
    if (!claims) return NextResponse.json({ message: "Google could not verify this account. Please try again." }, { status: 401 });
    return NextResponse.json({ name: claims.name, email: claims.email });
  } catch (error) {
    console.error("Error in /api/auth/google-profile POST:", error);
    return NextResponse.json({ message: "Google autofill is temporarily unavailable. Please enter your details manually." }, { status: 502 });
  }
}
