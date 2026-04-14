import { timingSafeEqual } from "crypto";
import { auth0 } from "@/lib/auth0";
import { userRepository } from "@/src/adapters/database/user.repository";
import { checkRateLimit } from "@/src/shared/security/rate-limit";
import { clientIpFromRequest, enforceSameOrigin } from "@/src/shared/security/request-guards";
import { validateUserSyncPayload } from "@/src/shared/security/validation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIpFromRequest(req);
    const rateLimit = checkRateLimit(`users:sync:${ip}`, 30, 60_000);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const trustedHook = hasValidHookSecret(req);

    if (trustedHook) {
      const payload = validateUserSyncPayload(body);
      if (!payload) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const result = await userRepository.upsert({
        auth0Id: payload.sub,
        email: payload.email,
        username: payload.username,
      });

      return NextResponse.json({ ok: true, user: result });
    }

    if (!enforceSameOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const session = await auth0.getSession();
    const sessionUser = session?.user;

    if (!sessionUser?.sub || !sessionUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let username = sessionUser.nickname ?? sessionUser.name;
    if (typeof body === "object" && body && "username" in body && typeof body.username === "string") {
      username = body.username;
    }

    const payload = validateUserSyncPayload({
      sub: sessionUser.sub,
      email: sessionUser.email,
      username,
    });

    if (!payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await userRepository.upsert({
      auth0Id: payload.sub,
      email: payload.email,
      username: payload.username,
    });

    if (!result) {
      return NextResponse.json({ error: "Failed to sync user" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: result });
  } catch (e: any) {
    console.error("Failed to sync user", e);
    return NextResponse.json(
      {
        error: "Internal_error",
        detail: e?.message ?? "no message",
        code: e?.code ?? null,
      },
      { status: 500 }
    );
  }
}

function hasValidHookSecret(req: NextRequest): boolean {
  const expectedSecret = process.env.AUTH0_HOOK_SECRET;
  const providedSecret = req.headers.get("x-auth0-hook-secret");

  if (!expectedSecret || !providedSecret) {
    return false;
  }

  const expected = Buffer.from(expectedSecret);
  const provided = Buffer.from(providedSecret);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}
