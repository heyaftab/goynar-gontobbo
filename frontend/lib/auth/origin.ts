import type { NextRequest } from "next/server";

export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
    return originUrl.host === hostHeader || origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

