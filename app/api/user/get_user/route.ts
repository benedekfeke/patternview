import { auth0 } from "@/lib/auth0";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {

  const session = await auth0.getSession();
  const auth0_id = session?.user?.sub ?? null;

  if (!auth0_id) {
    return NextResponse.json({error: "Current session is invalid"}, {status: 401});
  }

  try {
    const result = await pool.query(
      "SELECT * from userprofile WHERE auth0_id = $1", [auth0_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({error: "Logged in user is not found in local database"}, {status: 404});
    }

    return NextResponse.json({success: true, user: result.rows[0]});

  } catch (e) {
    console.error("Error retrieving user from local DB:", e);
    return NextResponse.json(
      {error: "failed to retrieve user"},
      {status: 500}
    );
  }

}
