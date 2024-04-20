import { afterEach, beforeAll } from "bun:test";
import { db } from "./db";
import { runMigration } from "./db/migrator/migrateFunc";
import { mentee } from "./db/schemas/mentee";
import { user } from "./db/schemas/user";

function cleanup() {
  const tables = [mentee, user];
  const promises = tables.map((table) => db.delete(table));
  return Promise.all(promises).catch((err) => console.log("err is", err));
}

beforeAll(async () => {
  await cleanup();
  await runMigration();
});

afterEach(async () => {
  await cleanup();
});
