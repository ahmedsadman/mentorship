import { describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { mentee } from "@app/db/schemas/mentee";
import { user } from "@app/db/schemas/user";
import app from "@app/index";
import { eq } from "drizzle-orm";

describe("/mentee", () => {
  test("POST /mentee", async () => {
    const bodyData = {
      name: "Test",
      email: "test_mentee@email.com",
      password: "test123",
      plan: "lite",
      price: 250,
    };

    const res = await app.request("/mentee", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    expect(res.status).toBe(201);

    const dbUser = await db
      .select()
      .from(user)
      .where(eq(user.email, bodyData.email));

    const dbMentee = await db
      .select()
      .from(mentee)
      .where(eq(mentee.userId, dbUser[0].id));

    const mockResp = {
      user: {
        id: dbUser[0].id,
        name: bodyData.name,
        email: bodyData.email,
        createdAt: dbUser[0].createdAt?.toISOString(),
      },
      mentee: {
        id: dbMentee[0].id,
        active: true,
        plan: bodyData.plan,
        price: bodyData.price,
      },
    };

    expect(dbUser[0]).not.toBeEmpty();
    expect(dbMentee[0]).not.toBeEmpty();
    expect(dbMentee[0].plan).toEqual("lite");
    expect(await res.json()).toEqual(mockResp);
  });
});
