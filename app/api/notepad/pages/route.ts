import { notepadRepository } from "@/src/adapters/database/notepad.repository";
import { getCurrentUser } from "@/src/domain/user/user.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
      
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

