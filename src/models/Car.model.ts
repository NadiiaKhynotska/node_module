import { model, Schema } from "mongoose";

import { EProducer } from "../enums";

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

export const Car = model("car", carSchema);
