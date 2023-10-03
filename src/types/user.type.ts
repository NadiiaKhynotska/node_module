import { Document } from "mongoose";

import { EGenders } from "../enums";

export interface IUser extends Document {
  name?: string;
  age?: number;
  genders?: EGenders;
  email: string;
  password: string;
}

export type IUserCredentials = Pick<IUser, "email" | "password">; //take only 'email' and 'password ' from interface IUser
// export type IUserCredentials = Omit<IUser, "email" | "password">; //take all fields except password and email
