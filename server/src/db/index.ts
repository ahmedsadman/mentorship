import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const {
  DB_HOST = "localhost",
  DB_NAME = "mentorship-dev",
  DB_USER = "postgres",
  DB_PORT = 5432,
  DB_PASSWORD = "password",
} = process.env;

const url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const queryClient = postgres(url);
const db = drizzle(queryClient);

export { db };
