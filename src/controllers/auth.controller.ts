import { NextFunction, Request, Response } from "express";

import { EEmailAction } from "../enums/EEmailAction";
import { authService } from "../services/auth.service";
import { emailService } from "../services/email.service";
import { IToken, ITokenPayload, ITokensPair } from "../types/token.type";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);
      await emailService.sendMail(req.body.email, EEmailAction.REGISTER, {
        name: req.body.name,
      });

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokensPair = await authService.login(req.body);

      return res.json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const tokenEntity = req.res.locals.tokenEntity as IToken;
      const tokensPair = await authService.refresh(tokenPayload, tokenEntity);

      return res.status(201).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const accessToken = req.res.locals.accessToken as string;

      await authService.logout(accessToken);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;

      await authService.logoutAll(tokenPayload.userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
