import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { url } from "..";

const migrationClient = postgres(url, { max: 1 });
const db = drizzle(migrationClient);

export async function runMigration() {
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  await migrationClient.end();
}
