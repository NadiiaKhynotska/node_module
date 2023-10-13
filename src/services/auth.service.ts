import { ObjectId } from "mongodb";

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
      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
          name: user.name,
        },
        EActionToken.activate,
      );
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
      const user = await userRepository.getOneByParams({ email: dto.email }, [
        "password",
      ]);
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
        tokenRepository.create({
          ...tokenPair,
          _userId: new ObjectId(payload.userId),
        }),
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

  public async logoutAll(userId: string): Promise<void> {
    try {
      await tokenRepository.deleteManyByUserId(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activate(token: string): Promise<void> {
    try {
      tokenService.checkActionToken(token, EActionToken.activate);
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
      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
          name: user.name,
        },
        EActionToken.activate,
      );
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

  public async forgotPassword(user: IUser): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
        },
        EActionToken.forgotPassword,
      );
      await Promise.all([
        actionTokenRepository.create({
          token: actionToken,
          type: EActionToken.forgotPassword,
          _userId: user._id,
        }),
        emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
          name: user.name,
          actionToken,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async setForgotPassword(
    actionToken: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const payload = tokenService.checkActionToken(
        actionToken,
        EActionToken.forgotPassword,
      );
      const entity = await actionTokenRepository.findOne({
        token: actionToken,
      });

      if (!entity) {
        throw new ApiError("Not valid token", 400);
      }
      const newHashedPassword = await passwordService.hash(newPassword);

      await Promise.all([
        userRepository.update(payload.userId.toString(), {
          password: newHashedPassword,
        }),
        actionTokenRepository.deleteOne({ token: actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    data: { newPassword: string; oldPassword: string },
    userId: string,
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);
      const isMatched = passwordService.compare(
        data.oldPassword,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError("invalid password", 400);
      }

      const hashedNewPassword = await passwordService.hash(data.newPassword);
      await userRepository.update(user._id, { password: hashedNewPassword });
      // await tokenRepository.deleteManyByUserId(user._id);
      await this.logoutAll(user._id);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
