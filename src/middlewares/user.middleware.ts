import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { userRepository } from "../repositories";

class UserMiddleware {
  public async getByIdOrThrow(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.params;
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new ApiError("user nor found", 404);
      }
      req.res.locals = user;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
