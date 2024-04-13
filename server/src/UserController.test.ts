import { describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schemas/user";
import app from "./index";

// Placeholder test. Later move inside controller
describe("UserController", () => {
  test("POST /user", async () => {
    const bodyData = {
      name: "Test",
      email: "test@email.com",
    };

    const res = await app.request("/user", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    expect(res.status).toBe(201);

    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, "test@email.com"));

    console.log('hiii');
    expect(result[0]).toBeEmpty();
  });
});
