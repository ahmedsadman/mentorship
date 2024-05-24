import { afterEach, beforeAll } from "bun:test";
import { db } from "./db";
import { runMigration } from "./db/migrator/migrateFunc";
import { mentee } from "./db/schemas/mentee";
import { session } from "./db/schemas/session";
import { user } from "./db/schemas/user";

async function cleanup() {
  const tables = [session, mentee, user];
  for (const table of tables) {
    await db.delete(table);
  }
}

beforeAll(async () => {
  await runMigration();
});

afterEach(async () => {
  await cleanup();
});
