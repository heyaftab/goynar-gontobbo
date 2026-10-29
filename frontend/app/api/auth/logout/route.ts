import { proxyAuthRequest } from "@/lib/auth/backend-proxy";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export function POST(request: NextRequest) {
  return proxyAuthRequest(request, "logout");
}
