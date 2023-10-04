import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async update(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.update(userId, dto);
  }

  public async deleteOne(userId: string): Promise<void> {
    await userRepository.deleteOne(userId);
  }
}

export const userService = new UserService();
