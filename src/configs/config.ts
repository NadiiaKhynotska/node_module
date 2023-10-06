import { config } from "dotenv";

config();
export const configs = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
  SECRET_SALT: process.env.SECRET_SALT,
  JWT_ACCESS_SECRET_WORD: process.env.JWT_ACCESS_SECRET_WORD,
  JWT_REFRESH_SECRET_WORD: process.env.JWT_REFRESH_SECRET_WORD,

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,
};
