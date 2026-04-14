import { notepadRepository } from "@/src/adapters/database/notepad.repository";
import { getCurrentUser } from "@/src/domain/user/user.service";
import { checkRateLimit } from "@/src/shared/security/rate-limit";
import { clientIpFromRequest, enforceSameOrigin } from "@/src/shared/security/request-guards";
import { parsePageNumber, validatePageUpdatePayload } from "@/src/shared/security/validation";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {params: Promise<{pageNumber: string}>};

// get single page
// _req is not used, but there bc Next can't skip the first parameter, the request
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { pageNumber } = await params;
    const normalizedPageNumber = parsePageNumber(pageNumber);
    if (!normalizedPageNumber) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const notepad = await notepadRepository.findByUserId(user.id);
    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    const page = await notepadRepository.getPage(notepad.id, normalizedPageNumber);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// PUT - update/create page (upsert)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!enforceSameOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { pageNumber } = await params;
    const normalizedPageNumber = parsePageNumber(pageNumber);
    if (!normalizedPageNumber) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = clientIpFromRequest(req);
    const rateLimit = checkRateLimit(`notepad:upsert:${user.id}:${ip}`, 60, 60_000);
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

    const notepad = await notepadRepository.getOrCreateForUser(user.id);
    const body = await req.json().catch(() => null);
    const validated = validatePageUpdatePayload(body);
    if (!validated) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const page = await notepadRepository.upsertPage(
      notepad.id, 
      normalizedPageNumber,
      validated
    );

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE page
export async function DELETE(req: NextRequest, {params}: RouteParams) {
  try {
    if (!enforceSameOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const {pageNumber} = await params;
    const normalizedPageNumber = parsePageNumber(pageNumber);
    if (!normalizedPageNumber) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = clientIpFromRequest(req);
    const rateLimit = checkRateLimit(`notepad:delete:${user.id}:${ip}`, 30, 60_000);
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

    const notepad = await notepadRepository.findByUserId(user.id);
    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    const deleted = await notepadRepository.deletePage(notepad.id, normalizedPageNumber);

    if (!deleted) {
      return NextResponse.json(
        {error: 'Page not found'},
        {status: 404}
      );
    }

    return NextResponse.json(
      {success: true}
    );
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

