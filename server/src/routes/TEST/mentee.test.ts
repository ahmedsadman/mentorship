import { describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { mentee } from "@app/db/schemas/mentee";
import { session } from "@app/db/schemas/session";
import { user } from "@app/db/schemas/user";
import app from "@app/index";
import menteeService from "@app/service/MenteeService";
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

  test("POST /mentee/:id/session", async () => {
    const mentee = await menteeService.createMentee({
      name: "Test",
      email: "test@email.com",
      password: "123",
      plan: "lite",
      price: 100,
    });
    const menteeId = mentee.mentee.id;

    const bodyData = {
      startTime: "2024-05-24T09:07:30.800Z",
      endTime: "2024-05-24T09:07:45.800Z",
    };

    const res = await app.request(`/mentee/${menteeId}/session`, {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    const dbSession = await db
      .select()
      .from(session)
      .where(eq(session.menteeId, menteeId));

    expect(dbSession[0]).not.toBeEmpty();

    const mockResp = {
      id: dbSession[0].id,
      menteeId,
      startTime: bodyData.startTime,
      endTime: bodyData.endTime,
      status: "pending",
    };

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(mockResp);
  });
});
