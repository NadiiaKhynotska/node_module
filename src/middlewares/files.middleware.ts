import { NextFunction, Request, Response } from "express";

import { avatarConfig } from "../configs/avatar.config";
import { ApiError } from "../errors";

class FilesMiddleware {
  public async isAvatarValid(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (Array.isArray(req.files.avatar)) {
        throw new ApiError("Avatar is not aloud to be an array of images", 400);
      }

      const { size, mimetype } = req.files.avatar;

      if (size > avatarConfig.MAX_SIZE) {
        throw new ApiError("Avatar is to big", 400);
      }
      if (!avatarConfig.MIMETYPES.includes(mimetype)) {
        throw new ApiError("Avatar has invalid format", 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const filesMiddleware = new FilesMiddleware();
