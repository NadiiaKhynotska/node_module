import { Document } from "mongoose";

import { EProducer } from "../enums";

export interface ICar extends Document {
  year?: number;
  model?: string;
  producer?: EProducer;
}
