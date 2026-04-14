import { NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function enforceSameOrigin(request: NextRequest): boolean {
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) {
    return true;
  }

  const expectedOrigin = new URL(request.url).origin;

  const origin = request.headers.get("origin");
  if (origin) {
    return safeOrigin(origin) === expectedOrigin;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return safeOrigin(referer) === expectedOrigin;
  }

  return false;
}

export function clientIpFromRequest(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function safeOrigin(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}
