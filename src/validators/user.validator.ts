import joi from "joi";

import { regexConstant } from "../constants";
import { EGenders } from "../enums";

export class UserValidator {
  static firstName = joi.string().min(4).max(40).trim();
  static age = joi.number().min(18).max(190);
  static gender = joi.valid(...Object.values(EGenders));
  static email = joi.string().regex(regexConstant.EMAIL).trim();
  static password = joi.string().regex(regexConstant.PASSWORD).trim();

  static update = joi.object({
    name: this.firstName,
    age: this.age,
    gender: this.gender,
  });

  static register = joi.object({
    name: this.firstName.required(),
    age: this.age.required(),
    gender: this.gender.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
