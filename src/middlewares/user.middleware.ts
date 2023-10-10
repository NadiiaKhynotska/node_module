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
        throw new ApiError("User nor found", 404);
      }
      req.res.locals = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isEmailUniq(req: Request, _res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await userRepository.getOneByParams({ email });
      if (user) {
        throw new ApiError("Email already exist", 409);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public isUserExist<T>(field: keyof T) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const user = await userRepository.getOneByParams({
          [field]: req.body[field],
        });
        if (!user) {
          throw new ApiError("User not found", 400);
        }
        req.res.locals = user;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
