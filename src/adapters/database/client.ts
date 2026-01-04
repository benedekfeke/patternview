import { Pool } from "pg";

declare global {
  var pgPool: Pool | undefined;
}

const pool = global.pgPool ?? new Pool({
    connectionString: process.env.POSTGRES_URL
});

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export { pool };

