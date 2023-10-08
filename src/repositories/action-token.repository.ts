import { FilterQuery } from "mongoose";

import { EActionToken } from "../enums/EActionToken";
import { actionToken } from "../models/ActionToken.model";
import { IActionToken } from "../types/token.type";

class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return await actionToken.create(dto);
  }
  public async deleteOne(params: FilterQuery<IActionToken>): Promise<void> {
    await actionToken.deleteOne(params);
  }

  public async deleteManyByUserIdAndType(
    userId: string,
    type: EActionToken,
  ): Promise<void> {
    await actionToken.deleteMany({ _userId: userId, type });
  }
  public async findOne(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return await actionToken.findOne(params);
  }
}
export const actionTokenRepository = new ActionTokenRepository();
