import menteeRepo from "@app/repo/MenteeRepo";
import type { QueryUser, WebhookPayload } from "@app/types";
import {
  type NewMentee,
  type NewSession,
  type NewUser,
  type QueryMentee,
  WebhookTrigger,
} from "@app/types";
import sessionService from "./SessionService";
import { UserService } from "./UserService";

type MenteeUser = NewUser & NewMentee;
export type MenteeCreateResponse = {
  // TODO: Fetch public fields from class
  user: Pick<QueryUser, "id" | "name" | "email" | "createdAt">;
  mentee: Pick<QueryMentee, "id" | "plan" | "price" | "active">;
};

class MenteeService extends UserService {
  public async createMentee(menteeUser: MenteeUser) {
    const { name, email, password, plan, price } = menteeUser;
    const dbUser = await this.createUser({ name, email, password });
    const dbMentee = await menteeRepo.create({
      plan,
      price,
      userId: dbUser.id,
    });

    return {
      user: dbUser,
      mentee: dbMentee,
    };
  }

  public async createSession(session: NewSession) {
    return sessionService.createSession(session);
  }

  public async cancelSession(bookingId: number) {
    return sessionService.updateSession(bookingId, { status: "cancelled" });
  }

  public async getByEmail(email: string) {
    return menteeRepo.getByEmail(email);
  }

  public async handleWebhookSession(payload: WebhookPayload) {
    const { length, startTime, endTime, bookingId, attendees } =
      payload.payload;
    const { email } = attendees[0];
    const { mentee } = await this.getByEmail(email);

    if (!mentee) {
      throw new Error("Mentee not found");
    }

    if (payload.triggerEvent === WebhookTrigger.BOOKING_CREATED) {
      await this.createSession({
        menteeId: mentee.id,
        length,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        bookingId,
        // For some reason, could not do DB migration of enums to change default to 'accepted'
        // Getting error, 'unsafe use of new enum value "accepted"'
        // Could be related to Drizzle-specific issue. Should investigate (low priority)
        status: "accepted",
      });
    }

    if (
      payload.triggerEvent === WebhookTrigger.BOOKING_CANCELLED &&
      bookingId
    ) {
      await this.cancelSession(bookingId);
    }
  }
}

export default new MenteeService();
