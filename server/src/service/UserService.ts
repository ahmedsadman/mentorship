import type { NewUser } from "../db/types";
import UserRepo from "../repo/UserRepo";

class UserService {
  public async createUser(user: NewUser) {
    return UserRepo.create(user);
  }
}

export default new UserService();
