import { model, Schema } from "mongoose";

import { EGenders } from "../enums";

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
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model("user", userSchema);
