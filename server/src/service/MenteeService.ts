import menteeRepo from "@app/repo/MenteeRepo";
import type { NewMentee, NewUser } from "@app/types";
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
}

export default new MenteeService();
