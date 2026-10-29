import { proxyAuthRequest } from "@/lib/auth/backend-proxy";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return proxyAuthRequest(request, "me");
}
