import { describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { user } from "@app/db/schemas/user";
import app from "@app/index";
import { eq } from "drizzle-orm";

describe("/user", () => {
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

    expect(result[0]).not.toBeEmpty();
  });
});
