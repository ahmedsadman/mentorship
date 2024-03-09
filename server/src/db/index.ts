import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(process.env.DB_URL as string);
const db = drizzle(queryClient);

export { db };
