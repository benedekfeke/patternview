import { notepadRepository } from "@/src/adapters/database/notepad.repository";
import { getCurrentUser } from "@/src/domain/user/user.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notepad = await notepadRepository.findByUserId(user.id);

    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notepad });
  } catch (error) {
    console.error('Error fetching notepad:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const notepad = await notepadRepository.getOrCreateForUser(user.id);

    return NextResponse.json({success: true, notepad}, {status: 201})
  } catch (error) {
    console.error('Error creating notepad', error);
    return NextResponse.json(
      {error: "Internal error"},
      {status: 500}
    )
  }
}
