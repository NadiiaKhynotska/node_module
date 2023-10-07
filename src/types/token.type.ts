import { Document, Types } from "mongoose";

import { EActionToken } from "../enums/EActionToken";
import { IUser } from "./user.type";

export interface ITokenPayload {
  userId: Types.ObjectId;
  name: string;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}

export interface IActionToken extends Document {
  token: string;
  type: EActionToken;
  _userId: Types.ObjectId | IUser;
}
