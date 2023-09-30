import { NextFunction, Request, Response } from "express";

import { userService } from "../services";
import { IUser } from "../types";

class UserController {
  public async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals;
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
