import { CreateUserInput, UpdateUserInput, User } from '@/src/domain/user/user.types';
import { pool } from "./client";

export const userRepository = {
 
  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM userprofile WHERE auth0_id = $1', [auth0Id]
    );
    return result.rows[0] ?? null;
  },

  async upsert(input: CreateUserInput): Promise<User> {
    const result = await pool.query(
      `INSERT INTO userprofile (auth0_id, email, username)
      VALUES ($1,$2,$3)
      ON CONFLICT (auth0_id)
      DO UPDATE SET email = EXCLUDED.email
      RETURNING *`,
      [input.auth0Id, input.email, input.username]
    );
    return result.rows[0];
  },

  async updateField(auth0Id: string, field: keyof UpdateUserInput, value: string): Promise<User> {
    const allowedFields = ['username', 'age'];
    if (!allowedFields.includes(field)) {
      throw new Error(`Field ${field} not allowed`);
    }

    const result = await pool.query(
      `UPDATE userprofile SET ${field} = $1 WHERE auth0_id = $2 RETURNING *`,
      [value, auth0Id]
    );
    return result.rows[0];
  },
};
