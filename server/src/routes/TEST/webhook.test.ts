import { beforeEach, describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { mentee } from "@app/db/schemas/mentee";
import { session } from "@app/db/schemas/session";
import { user } from "@app/db/schemas/user";
import app from "@app/index";
import menteeService, {
  type MenteeCreateResponse,
} from "@app/service/MenteeService";
import { eq } from "drizzle-orm";

describe("/webhook", () => {
  let mockMentee1: MenteeCreateResponse;
  let mockMentee2: MenteeCreateResponse;

  beforeEach(async () => {
    mockMentee1 = await menteeService.createMentee({
      name: "Test",
      email: "test@email.com",
      password: "123",
      plan: "lite",
      price: 100,
    });

    mockMentee2 = await menteeService.createMentee({
      name: "Another Mentee",
      email: "test2@email.com",
      password: "123",
      plan: "standard",
      price: 120,
    });
  });

  const createPayload = (email: string, overrides = {}) => ({
    triggerEvent: "BOOKING_CREATED",
    payload: {
      startTime: "2024-06-19T07:43:51.464Z",
      endTime: "2024-06-19T07:50:51.464Z",
      length: 45,
      attendees: [
        {
          email,
        },
      ],
      bookingId: null,
      ...overrides,
    },
  });

  test("/POST session", async () => {
    const bodyData1 = createPayload(mockMentee1.user.email, { bookingId: 1 });
    const bodyData2 = createPayload(mockMentee2.user.email, { bookingId: 2 });

    const makeDBQuery = (email: string) =>
      db
        .select()
        .from(session)
        .leftJoin(mentee, eq(session.menteeId, mentee.id))
        .leftJoin(user, eq(mentee.userId, user.id))
        .where(eq(user.email, email));

    const res = await app.request("/webhook/session", {
      method: "POST",
      body: JSON.stringify(bodyData1),
    });

    expect(res.status).toBe(200);
    const dbResult = await makeDBQuery(mockMentee1.user.email);

    expect(dbResult[0]).not.toBeEmpty();
    expect(dbResult[0].session.bookingId).toEqual(bodyData1.payload.bookingId);
    expect(dbResult[0].session.startTime).toEqual(
      new Date(bodyData1.payload.startTime),
    );
    expect(dbResult[0].session.endTime).toEqual(
      new Date(bodyData1.payload.endTime),
    );
    expect(dbResult[0].session.length).toEqual(45);
    expect(dbResult[0].user?.email).toEqual(mockMentee1.user.email);

    const res2 = await app.request("/webhook/session", {
      method: "POST",
      body: JSON.stringify(bodyData2),
    });

    expect(res2.status).toBe(200);
    const dbResult2 = await makeDBQuery(mockMentee2.user.email);

    expect(dbResult2[0]).not.toBeEmpty();
    expect(dbResult2[0].session.bookingId).toEqual(bodyData2.payload.bookingId);
    expect(dbResult2[0].session.startTime).toEqual(
      new Date(bodyData1.payload.startTime),
    );
    expect(dbResult2[0].session.endTime).toEqual(
      new Date(bodyData1.payload.endTime),
    );
    expect(dbResult2[0].session.length).toEqual(45);
    expect(dbResult2[0].user?.email).toEqual(mockMentee2.user.email);
  });
});
