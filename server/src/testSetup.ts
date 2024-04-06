import { afterAll, beforeAll } from "bun:test";
import { db } from "./db";
import { runMigration } from "./db/migrator/migrateFunc";
import { user } from "./db/schemas/user";

function cleanup() {
	const tables = [user];
	const promises = tables.map((table) => db.delete(table));
	return Promise.all(promises).catch((err) => console.log("err is", err));
}

beforeAll(async () => {
	await runMigration();
});

afterAll(async () => {
	await cleanup();
});
