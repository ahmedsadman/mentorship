import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = postgres(process.env.DB_URL as string, { max: 1 });
const db = drizzle(migrationClient);

export async function runMigration() {
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  await migrationClient.end();
}
