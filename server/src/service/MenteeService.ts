import menteeRepo from "@app/repo/MenteeRepo";
import type { NewMentee, NewSession, NewUser } from "@app/types";
import sessionService from "./SessionService";
import { UserService } from "./UserService";

type MenteeUser = NewUser & NewMentee;

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
}

export default new MenteeService();
