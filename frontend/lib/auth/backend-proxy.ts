import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/auth/origin";
import { getLaravelApiUrl } from "@/lib/laravel-api-url";

type AuthAction = "register" | "login" | "google" | "me" | "profile" | "password" | "logout" | "forgot-password" | "reset-password";

const methods: Record<AuthAction, "GET" | "POST" | "PUT"> = {
  register: "POST",
  login: "POST",
  google: "POST",
  me: "GET",
  profile: "PUT",
  password: "PUT",
  logout: "POST",
  "forgot-password": "POST",
  "reset-password": "POST",
};

export async function proxyAuthRequest(request: NextRequest, action: AuthAction) {
  const method = methods[action];
  if (method !== "GET" && !isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Request origin is invalid." }, { status: 403 });
  }

  const apiBase = getLaravelApiUrl();
  if (!apiBase) {
    console.error("Account API URL is missing. Configure LARAVEL_API_URL on the frontend deployment.");
    return NextResponse.json(
      { message: "Account service is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const authorization = request.headers.get("authorization");
    if (authorization) headers.Authorization = authorization;
    if (method !== "GET") headers["Content-Type"] = "application/json";

    const response = await fetch(`${apiBase}/api/v1/auth/${action}`, {
      method,
      headers,
      ...(method === "GET" ? {} : { body: await request.text() }),
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
