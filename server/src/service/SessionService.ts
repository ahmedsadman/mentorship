import menteeRepo from "@app/repo/MenteeRepo";
import sessionRepo from "@app/repo/SessionRepo";
import type { NewSession } from "@app/types";

export type SearchPayload = {
  email: string;
  startTime?: string | undefined;
  endTime?: string | undefined;
};

class SessionService {
  public async createSession(session: NewSession) {
    return sessionRepo.create(session);
  }

  public async updateSession(bookingId: number, updatedFields: object) {
    return sessionRepo.updateSession(bookingId, updatedFields);
  }

  public async getMenteeSessions(menteeId: number) {
    return sessionRepo.getMenteeSessions(menteeId);
  }

  public async searchSession(payload: SearchPayload) {
    const mentee = await menteeRepo.getByEmail(payload.email);
    if (!mentee.mentee) {
      throw new Error("Mentee with given email not found");
    }

    const sessions = await this.getMenteeSessions(mentee.mentee.id);
    return {
      mentee: mentee.mentee,
      sessionCount: sessions.length,
      sessions,
    };
  }
}

export default new SessionService();
