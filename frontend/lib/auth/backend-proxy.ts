import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/auth/origin";

export async function proxyAuthRequest(request: NextRequest, action: "register" | "login") {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Request origin is invalid." }, { status: 403 });
  }

  const apiBase = process.env.LARAVEL_API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return NextResponse.json(
      { message: "Account services are not configured. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${apiBase}/api/v1/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the account service. Please try again later." },
      { status: 502 },
    );
  }
}
