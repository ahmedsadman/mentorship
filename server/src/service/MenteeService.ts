import type { QueryUser } from "@app/db/types";
import menteeRepo from "@app/repo/MenteeRepo";
import type { NewMentee, NewSession, NewUser, QueryMentee } from "@app/types";
import sessionService from "./SessionService";
import { UserService } from "./UserService";

type MenteeUser = NewUser & NewMentee;
export type MenteeCreateResponse = {
  // TODO: Fetch public fields from class
  user: Pick<QueryUser, "id" | "name" | "email" | "createdAt">;
  mentee: Pick<QueryMentee, "id" | "plan" | "price" | "active">;
};

// TODO: Find a suitable spot to place such types
type Attendee = {
  email: string;
  name: string;
  timezone: string;
  utcOffset: number;
};

export type WebhookPayload = {
  triggerEvent: string;
  createdAt: string;
  payload: {
    attendees: Attendee[];
    startTime: string;
    endTime: string;
    length: number;
    bookingId: number | null;
  };
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
}

export default new MenteeService();
