import { notepadRepository } from "@/src/adapters/database/notepad.repository";
import { getCurrentUser } from "@/src/domain/user/user.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {params: Promise<{pageNumber: string}>};

// get single page
// _req is not used, but there bc Next can't skip the first parameter, the request
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { pageNumber } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const notepad = await notepadRepository.findByUserId(user.id);
    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    const page = await notepadRepository.getPage(notepad.id, parseInt(pageNumber));
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
    const { pageNumber } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notepad = await notepadRepository.getOrCreateForUser(user.id);
    const { title, content } = await req.json();

    const page = await notepadRepository.upsertPage(
      notepad.id, 
      parseInt(pageNumber), 
      { title, content }
    );

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE page
export async function DELETE(_req: NextRequest, {params}: RouteParams) {
  try {
    const {pageNumber} = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notepad = await notepadRepository.findByUserId(user.id);
    if (!notepad) {
      return NextResponse.json({ error: 'Notepad not found' }, { status: 404 });
    }

    const deleted = await notepadRepository.deletePage(notepad.id, parseInt(pageNumber));

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

