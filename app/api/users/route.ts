import { auth0 } from "@/lib/auth0";
import { userRepository } from "@/src/adapters/database/user.repository";
import { UpdateUserInput } from "@/src/domain/user/user.types";
import { NextRequest, NextResponse } from "next/server";


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

    console.log(user)
    return NextResponse.json({success: true, user});
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      {error: "Internal error"},
      {status: 500}
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { field, value } = (await req.json()) as { 
    field: keyof UpdateUserInput; 
    value: string 
  };

  try {
    // check user exists
    const userResult = await userRepository.findByAuth0Id(user.sub)

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateResult = await userRepository.updateField(user.sub, field, value)

    return NextResponse.json({ success: true, user: updateResult});
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
