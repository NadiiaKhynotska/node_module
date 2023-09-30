import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
}

export const userService = new UserService();
