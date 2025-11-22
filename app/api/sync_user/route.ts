import { NextResponse } from "next/server";
import { Pool } from 'pg';

export const runtime = "nodejs";

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export async function POST(req: Request) {
  try {
    console.log("sync-user called");
    const body = await req.json();
    const { sub, email, username } = body;

    if (!sub || !email) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO userprofile (auth0_id, email, username)
       VALUES ($1, $2, $3)
       ON CONFLICT (auth0_id)
       DO UPDATE SET
         email = EXCLUDED.email,
         username = EXCLUDED.username
       RETURNING *`,
      [sub, email, username ?? null]
    );

    console.log('DB result:', result.rows[0]);

    return NextResponse.json({ ok: true, user: result.rows[0] });
  } catch (e: any) {
    console.error('sync_user error:', e);
    return NextResponse.json(
      {
        error: 'internal_error',
        detail: e?.message ?? 'no message',
        code: e?.code ?? null,
      },
      { status: 500 }
    );
  }
}
