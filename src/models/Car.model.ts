import { model, Schema, Types } from "mongoose";

import { EProducer } from "../enums";
import { ICar } from "../types";
import { User } from "./User.model";

const carSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
    producer: {
      type: String,
      enum: EProducer,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>("car", carSchema);
