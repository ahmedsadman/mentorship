import { beforeEach, describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { mentee } from "@app/db/schemas/mentee";
import { session } from "@app/db/schemas/session";
import { user } from "@app/db/schemas/user";
import app from "@app/index";
import menteeService, {
  type MenteeCreateResponse,
} from "@app/service/MenteeService";
import sessionService from "@app/service/SessionService";
import { eq } from "drizzle-orm";

describe("/mentee", () => {
  let mockMentee: MenteeCreateResponse;
  let mockMentee2: MenteeCreateResponse;

  beforeEach(async () => {
    mockMentee = await menteeService.createMentee({
      name: "Test",
      email: "test@email.com",
      plan: "lite",
      price: 100,
    });

    mockMentee2 = await menteeService.createMentee({
      name: "Test2",
      email: "test2@email.com",
      plan: "standard",
      price: 240,
    });
  });

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
    const menteeId = mockMentee.mentee.id;

    const bodyData = {
      startTime: "2024-05-24T09:07:30.800Z",
      endTime: "2024-05-24T09:07:45.800Z",
      length: 45,
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
      length: 45,
      status: "accepted",
      bookingId: null,
    };

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(mockResp);
  });

  test("GET /mentee/:id/session", async () => {
    const menteeId = mockMentee.mentee.id;

    const bodyData = [
      {
        startTime: "2024-05-24T09:07:30.800Z",
        endTime: "2024-05-24T09:07:45.800Z",
      },
      {
        startTime: "2024-06-24T09:07:30.800Z",
        endTime: "2024-06-24T09:07:45.800Z",
      },
    ];

    const promises = bodyData.map((data) =>
      sessionService.createSession({
        menteeId,
        length: 30,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: "accepted",
        bookingId: 1,
      }),
    );

    const createdSessions = await Promise.all(promises);
    const expectedResp = createdSessions.map((session) => ({
      id: session.id,
      menteeId: session.menteeId,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      length: session.length,
      status: "accepted",
      bookingId: 1,
    }));

    const res = await app.request(`/mentee/${menteeId}/session`, {
      method: "GET",
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedResp);
  });

  test("PATCH /mentee/:id/session/:bookingId (Change status)", async () => {
    // Create Session
    const menteeId = mockMentee.mentee.id;
    const bodyData = {
      startTime: "2024-05-24T09:07:30.800Z",
      endTime: "2024-05-24T09:07:45.800Z",
      length: 45,
      bookingId: 123, // In webhook, provider will supply the bookingId
    };
    const createResp = await app.request(`/mentee/${menteeId}/session`, {
      method: "POST",
      body: JSON.stringify(bodyData),
    });
    expect(createResp.status).toBe(201);

    // Cancel the created session
    const updateResp = await app.request(`/mentee/${menteeId}/session/123`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    });
    expect(updateResp.status).toBe(200);
    const jsonResp = await updateResp.json();
    expect(jsonResp.bookingId).toBe(123);
    expect(jsonResp.status).toBe("cancelled");
  });

  describe("GET /session/search", async () => {
    // create the sessions
    // TODO: Add a better way to create session through direct function calls
    let menteeId: number;
    let menteeId2: number;

    beforeEach(async () => {
      menteeId = mockMentee.mentee.id;
      menteeId2 = mockMentee2.mentee.id;

      const bodyData = [
        {
          menteeId,
          startTime: "2024-05-24T09:07:30.800Z",
          endTime: "2024-05-24T09:07:45.800Z",
        },
        {
          menteeId,
          startTime: "2024-06-05T09:07:30.800Z",
          endTime: "2024-06-05T09:07:45.800Z",
        },
        {
          menteeId,
          startTime: "2024-06-24T09:07:30.800Z",
          endTime: "2024-06-24T09:07:45.800Z",
        },
        {
          menteeId: menteeId2,
          startTime: "2024-06-03T09:07:30.800Z",
          endTime: "2024-06-03T09:07:45.800Z",
        },
      ];

      const promises = bodyData.map((data, index) =>
        sessionService.createSession({
          menteeId: data.menteeId,
          length: 30,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          status: "accepted",
          bookingId: index,
        }),
      );

      await Promise.all(promises);
    });

    test("Search by email works as expected", async () => {
      const resp = await app.request(
        `/mentee/session/search?email=${mockMentee.user.email}`,
      );
      expect(resp.status).toBe(200);
      const jsonResp = await resp.json();

      expect(jsonResp.mentee.userId).toEqual(mockMentee.user.id);
      expect(jsonResp.sessionCount).toEqual(3);
    });

    test("Date filter works as expected", async () => {
      const resp = await app.request(
        `/mentee/session/search?email=${mockMentee.user.email}&startDate=2024-06-01&endDate=2024-06-30`,
      );
      expect(resp.status).toBe(200);
      const jsonResp = await resp.json();

      expect(jsonResp.mentee.userId).toEqual(mockMentee.user.id);
      expect(jsonResp.sessionCount).toEqual(2);
    });
  });
});
