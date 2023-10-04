import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { tokenRepository } from "../repositories/token.repository";
import { IUserCredentials } from "../types";
import { IToken, ITokenPayload, ITokensPair } from "../types/token.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUserCredentials): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      await userRepository.register({ ...dto, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(dto: IUserCredentials): Promise<ITokensPair> {
    try {
      const user = await userRepository.getOneByParams({ email: dto.email });
      if (!user) {
        throw new ApiError("Invalid credentials provided", 401);
      }

      const isMatched = await passwordService.compare(
        dto.password,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError("Invalid credentials provided", 401);
      }
      const tokenPair = await tokenService.generateTokenPair({
        userId: user._id,
        name: user.name,
      });

      await tokenRepository.create({ ...tokenPair, _userId: user._id });
      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    entity: IToken,
  ): Promise<ITokensPair> {
    try {
      const tokenPair = tokenService.generateTokenPair({
        userId: payload.userId,
        name: payload.name,
      });

      await Promise.all([
        tokenRepository.create({ ...tokenPair, _userId: payload.userId }),
        tokenRepository.deleteOne({ refreshToken: entity.refreshToken }),
      ]);
      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
