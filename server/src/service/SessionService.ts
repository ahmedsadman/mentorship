import sessionRepo from "@app/repo/SessionRepo";
import type { NewSession } from "@app/types";

class SessionService {
  public async createSession(session: NewSession) {
    return sessionRepo.create(session);
  }

  public async getMenteeSessions(menteeId: number) {
    return sessionRepo.getMenteeSessions(menteeId);
  }
}

export default new SessionService();
