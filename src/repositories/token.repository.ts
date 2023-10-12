import { FilterQuery, Types } from "mongoose";

import { Token } from "../models/Token.model";
import { IToken } from "../types/token.type";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  public async deleteOne(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }
  public async deleteManyByParams(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
  public async deleteManyByUserId(userId: Types.ObjectId): Promise<void> {
    await Token.deleteMany({ _userId: userId });
  }

  public async findOne(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
}
export const tokenRepository = new TokenRepository();
