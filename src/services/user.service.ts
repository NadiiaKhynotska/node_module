import { UploadedFile } from "express-fileupload";

import { EFileTypes } from "../enums/EFileTypes";
import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { IUser } from "../types";
import { IQuery } from "../types/query.type";
import { s3Service } from "./s3.service";

class UserService {
  public async getAllWithPagination(query: IQuery) {
    try {
      const queryString = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryString.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
      );
      return await userRepository.getAllWithPagination(queryObj);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(
    manageUserId: string,
    dto: Partial<IUser>,
    userId: string,
  ): Promise<IUser> {
    this.checkAbilityToManage(userId, manageUserId);
    return await userRepository.update(manageUserId, dto);
  }

  public async deleteOne(userId: string): Promise<void> {
    await userRepository.deleteOne(userId);
  }

  public async getMe(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }

  public async uploadAvatar(
    avatar: UploadedFile,
    userId: string,
  ): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    const filePath = await s3Service.uploadFile(
      avatar,
      EFileTypes.User,
      userId,
    );

    const updatedUser = await userRepository.update(userId, {
      avatar: filePath,
    });

    return updatedUser;
  }
  private checkAbilityToManage(userId: string, manageUserId: string): void {
    if (userId !== manageUserId) {
      throw new ApiError("You can not manage this user", 403);
    }
  }
}

export const userService = new UserService();
