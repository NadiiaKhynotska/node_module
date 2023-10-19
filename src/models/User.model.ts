import { model, Schema } from "mongoose";

import { EGenders } from "../enums";
import { EUsersStatus } from "../enums/EUsersStatus";
import { IUser } from "../types";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
      max: [199, "Maximum age  is 199"],
      min: [1, "Minimum age is 1"],
    },
    genders: {
      type: String,
      enum: EGenders,
    },
    status: {
      type: String,
      enum: EUsersStatus,
      default: EUsersStatus.inactive,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
