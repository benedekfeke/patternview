import { userRepository } from '@/src/adapters/database/user.repository';
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("sync-user called");
    const body = await req.json();
    const { sub, email, username } = body;

    if (!sub || !email) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }

    const result = await userRepository.upsert({auth0Id: sub, email, username});

    if (!result) {
      return NextResponse.json({error: 'Failed to sync user'}, {status: 404})
    }

    console.log('DB result:', result);

    return NextResponse.json({ ok: true, user: result });
  } catch (e: any) {
    console.error('Failed to sync user', e);
    return NextResponse.json(
      {
        error: 'Internal_error',
        detail: e?.message ?? 'no message',
        code: e?.code ?? null,
      },
      { status: 500 }
    );
  }
}
