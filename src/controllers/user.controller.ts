import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { userPresenter } from "../presenters/user.presenter";
import { userService } from "../services";
import { IUser } from "../types";
import { IQuery } from "../types/query.type";
import { ITokenPayload } from "../types/token.type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAllWithPagination(req.query as IQuery);
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

  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteOne(req.params.userId);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const updatedUser = await userService.update(
        req.params.userId,
        req.body,
        tokenPayload.userId,
      );

      res.status(201).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const me = await userService.getMe(tokenPayload.userId);

      res.status(201).json(me);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;
      const avatar = req.files.avatar as UploadedFile;

      const user = await userService.uploadAvatar(avatar, userId);

      const response = userPresenter.present(user);
      return res.json(response).sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
