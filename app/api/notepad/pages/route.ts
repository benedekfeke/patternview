import { notepadRepository } from "@/src/adapters/database/notepad.repository";
import { getCurrentUser } from "@/src/domain/user/user.service";
import { checkRateLimit } from "@/src/shared/security/rate-limit";
import { clientIpFromRequest } from "@/src/shared/security/request-guards";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
      
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = clientIpFromRequest(req);
    const rateLimit = checkRateLimit(`notepad:list:${user.id}:${ip}`, 90, 60_000);
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
    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    const pages = await notepadRepository.getPages(notepad.id);

    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

