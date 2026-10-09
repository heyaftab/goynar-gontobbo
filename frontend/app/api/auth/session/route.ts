import { NextRequest, NextResponse } from "next/server";
import { verifyGoogleIdToken } from "@/lib/auth/google";

export const runtime = "nodejs";
const cookieName = "gg_google_session";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Request origin is invalid." }, { status: 403 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.json({ message: "Google sign-in is not configured." }, { status: 503 });

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
    if (!claims || !claims.exp) return NextResponse.json({ message: "Google could not verify this account. Please try again." }, { status: 401 });

    const response = NextResponse.json({ name: claims.name, email: claims.email });
    response.cookies.set(cookieName, body.credential, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.min(3600, claims.exp - Math.floor(Date.now() / 1000)),
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Google sign-in is temporarily unavailable. Please try again." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Request origin is invalid." }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
