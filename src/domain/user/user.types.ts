export interface User {
  id: number;
  auth0_id: string,
  email: string,
  username: string | null;
  age: number | null;
}

export interface CreateUserInput {
  auth0Id: string;
  email: string;
  username?: string;
}

export interface UpdateUserInput {
  username?: string,
  age?: string;
}
