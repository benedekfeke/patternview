import { auth0 } from "@/lib/auth0";
import { fetchAuthorBooks } from "@/app/api/authorBookUtil";
import { checkRateLimit } from "@/src/shared/security/rate-limit";
import { clientIpFromRequest } from "@/src/shared/security/request-guards";
import { validateAuthorName } from "@/src/shared/security/validation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIpFromRequest(req);
  const rateLimit = checkRateLimit(`books:lookup:${session.user.sub}:${ip}`, 30, 60_000);
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

  const author = validateAuthorName(req.nextUrl.searchParams.get("author"));
  if (!author) {
    return NextResponse.json({ error: "Invalid author parameter" }, { status: 400 });
  }

  const books = await fetchAuthorBooks(author);

  return NextResponse.json(
    { books },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    }
  );
}
