import { auth0 } from "@/lib/auth0";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { field, value } = (await req.json()) as { field: string; value: string };

  // only allow some fields to be updated
  const allowedFields = ["username", "age"] as const;
  if (!allowedFields.includes(field as any)) {
    return NextResponse.json(
      { error: `Field ${field} not allowed` },
      { status: 401 }
    );
  }

  try {
    // check user exists
    const userResult = await pool.query(
      "SELECT id FROM userprofile WHERE auth0_id = $1",
      [user.sub]
    );

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // build safe query with validated column name
    const query = `
      UPDATE userprofile
      SET ${field} = $1
      WHERE auth0_id = $2
      RETURNING id, username, age
    `;

    const updateResult = await pool.query(query, [value, user.sub]);

    return NextResponse.json({ success: true, user: updateResult.rows[0] });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
