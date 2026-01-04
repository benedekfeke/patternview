import { auth0 } from "@/lib/auth0";
import { userRepository } from "@/src/adapters/database/user.repository";
import { User } from "./user.types";

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth0.getSession();
  const auth0Id = session?.user?.sub;

  if (!auth0Id) {
    return null;
  }

  return userRepository.findByAuth0Id(auth0Id);
}
