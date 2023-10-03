import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ITokenPayload, ITokensPair } from "../types/token.type";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET_WORD, {
      expiresIn: "4h",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET_WORD, {
      expiresIn: "3d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

export const tokenService = new TokenService();
