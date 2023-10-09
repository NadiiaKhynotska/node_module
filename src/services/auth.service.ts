import { Types } from "mongoose";

import { EActionToken } from "../enums/EActionToken";
import { EEmailAction } from "../enums/EEmailAction";
import { EUsersStatus } from "../enums/EUsersStatus";
import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { IUser, IUserCredentials } from "../types";
import { IToken, ITokenPayload, ITokensPair } from "../types/token.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      const user = await userRepository.register({
        ...dto,
        password: hashedPassword,
      });
      const actionToken = tokenService.generateActionToken({
        userId: user._id,
        name: user.name,
      });
      actionTokenRepository.create({
        token: actionToken,
        type: EActionToken.activate,
        _userId: user._id,
      });

      await emailService.sendMail(dto.email, EEmailAction.REGISTER, {
        name: dto.name,
        actionToken,
      });
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

  public async logout(accessToken: string): Promise<void> {
    try {
      tokenRepository.deleteOne({ accessToken });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async logoutAll(userId: Types.ObjectId): Promise<void> {
    try {
      await tokenRepository.deleteManyByUserId(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activate(token: string): Promise<void> {
    try {
      tokenService.checkActionToken(token);
      const entity = await actionTokenRepository.findOne({ token });

      if (!entity) {
        throw new ApiError("Not valid token", 400);
      }
      await Promise.all([
        actionTokenRepository.deleteManyByUserIdAndType(
          entity._userId.toString(),
          EActionToken.activate,
        ),
        userRepository.setStatus(
          entity._userId.toString(),
          EUsersStatus.active,
        ),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async sendActivationToken(tokenPayload: ITokenPayload): Promise<void> {
    try {
      const user = await userRepository.findById(
        tokenPayload.userId.toString(),
      );

      if (user.status !== EUsersStatus.inactive) {
        throw new ApiError("User can not be activated", 403);
      }
      const actionToken = tokenService.generateActionToken({
        userId: user._id,
        name: user.name,
      });
      actionTokenRepository.create({
        token: actionToken,
        type: EActionToken.activate,
        _userId: user._id,
      });

      await emailService.sendMail(user.email, EEmailAction.REGISTER, {
        name: user.name,
        actionToken,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
