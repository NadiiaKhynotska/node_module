import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async isRefreshTokenValid(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Authorization");
      if (!refreshToken) {
        throw new ApiError("Missing token", 401);
      }

      const payload = tokenService.checkToken(refreshToken, "refresh");

      const entity = await tokenRepository.findOne({ refreshToken });
      if (!entity) {
        throw new ApiError("Token is not valid", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.tokenEntity = entity;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isAccessTokenValid(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");
      if (!accessToken) {
        throw new ApiError("Missing token", 401);
      }

      const payload = tokenService.checkToken(accessToken, "access");

      const entity = await tokenRepository.findOne({ accessToken });
      if (!entity) {
        throw new ApiError("Token is not valid", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.tokenEntity = entity;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
