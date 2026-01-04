import { auth0 } from "@/lib/auth0";
import { userRepository } from "@/src/adapters/database/user.repository";
import { NextResponse } from "next/server";


export async function GET() {

  const session = await auth0.getSession();
  const auth0Id = session?.user?.sub ?? null;

  if (!auth0Id) {
    return NextResponse.json({error: "Current session is invalid"}, {status: 401});
  }

  try {
    const user = await userRepository.findByAuth0Id(auth0Id);

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json({success: true, user});
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      {error: "Internal error"},
      {status: 500}
    );
  }

}
