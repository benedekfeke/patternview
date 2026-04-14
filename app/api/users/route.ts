import { auth0 } from "@/lib/auth0";
import { userRepository } from "@/src/adapters/database/user.repository";
import { checkRateLimit } from "@/src/shared/security/rate-limit";
import { clientIpFromRequest, enforceSameOrigin } from "@/src/shared/security/request-guards";
import { validateUserFieldUpdate } from "@/src/shared/security/validation";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {

  const session = await auth0.getSession();
  const auth0Id = session?.user?.sub ?? null;

  if (!auth0Id) {
    return NextResponse.json({error: "Current session is invalid"}, {status: 401});
  }

  try {
    const user = await userRepository.findByAuth0Id(auth0Id);

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json({success: true, user});
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      {error: "Internal error"},
      {status: 500}
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!enforceSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIpFromRequest(req);
  const rateLimit = checkRateLimit(`users:put:${user.sub}:${ip}`, 20, 60_000);
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
  const validated = validateUserFieldUpdate(body);
  if (!validated) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { field, value } = validated;

  try {
    // check user exists
    const userResult = await userRepository.findByAuth0Id(user.sub)

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateResult = await userRepository.updateField(user.sub, field, value)

    return NextResponse.json({ success: true, user: updateResult});
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
