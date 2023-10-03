import { config } from "dotenv";

config();
export const configs = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
  SECRET_SALT: process.env.SECRET_SALT,
  JWT_ACCESS_SECRET_WORD: process.env.JWT_ACCESS_SECRET_WORD,
  JWT_REFRESH_SECRET_WORD: process.env.JWT_REFRESH_SECRET_WORD,
};
