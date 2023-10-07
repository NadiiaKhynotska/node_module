import { model, Schema, Types } from "mongoose";

import { EActionToken } from "../enums/EActionToken";
import { IActionToken } from "../types/token.type";
import { User } from "./User.model";

const TokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: EActionToken,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { timestamps: true, versionKey: false },
);

export const actionToken = model<IActionToken>("action-token", TokenSchema);
