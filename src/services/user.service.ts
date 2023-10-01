import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async create(dto: IUser) {
    const user = await userRepository.getOneByParams({ email: dto.email });
    if (user) {
      throw new ApiError("Email already exist", 409);
    }
    return await userRepository.create(dto);
  }

  public async update(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.update(userId, dto);
  }

  public async deleteOne(userId: string): Promise<void> {
    await userRepository.deleteOne(userId);
  }
}

export const userService = new UserService();
