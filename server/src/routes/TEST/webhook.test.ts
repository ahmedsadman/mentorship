import { beforeEach, describe, expect, test } from "bun:test";
import { db } from "@app/db";
import { mentee as menteeSchema } from "@app/db/schemas/mentee";
import { session as sessionSchema } from "@app/db/schemas/session";
import { user as userSchema } from "@app/db/schemas/user";
import app from "@app/index";
import menteeService, {
  type MenteeCreateResponse,
} from "@app/service/MenteeService";
import type { WebhookPayload } from "@app/service/MenteeService";
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

  const createPayload = (email: string, overrides = {}): WebhookPayload => ({
    triggerEvent: "BOOKING_CREATED",
    createdAt: "2024-05-19T07:43:51.464Z",
    payload: {
      startTime: "2024-06-19T07:43:51.464Z",
      endTime: "2024-06-19T07:50:51.464Z",
      length: 45,
      attendees: [
        {
          email,
          name: "Test",
          utcOffset: 0,
          timezone: "UTC",
        },
      ],
      bookingId: null,
      ...overrides,
    },
  });

  describe("POST /webhook/session", () => {
    type DBResult = {
      // TODO: Unify types in a single place
      session: typeof sessionSchema.$inferSelect | null;
      user: typeof userSchema.$inferSelect | null;
      mentee: typeof menteeSchema.$inferSelect | null;
    };

    const makeDBQuery = (email: string) =>
      db
        .select()
        .from(sessionSchema)
        .leftJoin(menteeSchema, eq(sessionSchema.menteeId, menteeSchema.id))
        .leftJoin(userSchema, eq(menteeSchema.userId, userSchema.id))
        .where(eq(userSchema.email, email));

    const assertSessionData = (
      dbResult: DBResult,
      bodyData: WebhookPayload,
      mockMentee: { user: { email: string } },
    ) => {
      if (!dbResult.session) {
        throw new Error("Session not found");
      }
      expect(dbResult).not.toBeEmpty();
      expect(dbResult.session.bookingId).toEqual(bodyData.payload.bookingId);
      expect(dbResult.session.startTime).toEqual(
        new Date(bodyData.payload.startTime),
      );
      expect(dbResult.session.endTime).toEqual(
        new Date(bodyData.payload.endTime),
      );
      expect(dbResult.session.length).toEqual(45);
      expect(dbResult.user?.email).toEqual(mockMentee.user.email);
    };

    test("Separate webhook sessions are handled properly", async () => {
      const bodyData1 = createPayload(mockMentee1.user.email, { bookingId: 1 });
      const bodyData2 = createPayload(mockMentee2.user.email, { bookingId: 2 });

      const res = await app.request("/webhook/session", {
        method: "POST",
        body: JSON.stringify(bodyData1),
      });

      expect(res.status).toBe(200);
      const dbResult = await makeDBQuery(mockMentee1.user.email);
      assertSessionData(dbResult[0], bodyData1, mockMentee1);

      const res2 = await app.request("/webhook/session", {
        method: "POST",
        body: JSON.stringify(bodyData2),
      });

      expect(res2.status).toBe(200);
      const dbResult2 = await makeDBQuery(mockMentee2.user.email);
      assertSessionData(dbResult2[0], bodyData2, mockMentee2);
    });
  });
});
