import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ApiError } from "../errors";
import { ITokenPayload, ITokensPair } from "../types/token.type";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET_WORD, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET_WORD, {
      expiresIn: "3d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: "access" | "refresh"): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case "access":
          secret = configs.JWT_ACCESS_SECRET_WORD;
          break;
        case "refresh":
          secret = configs.JWT_REFRESH_SECRET_WORD;
          break;
      }
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }

  public generateActionToken(payload: ITokenPayload): string {
    return jwt.sign(payload, configs.JWT_ACTION_SECRET_WORD, {
      expiresIn: "3d",
    });
  }

  public checkActionToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, configs.JWT_ACTION_SECRET_WORD) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
