import joi from "joi";

import { regexConstant } from "../constants";
import { EGenders } from "../enums";

export class UserValidator {
  static firstName = joi.string().min(4).max(40).trim();
  static age = joi.number().min(18).max(190);
  static gender = joi.valid(...Object.values(EGenders));

  static create = joi.object({
    name: this.firstName.required(),
    age: this.age.required(),
    gender: this.gender.required(),
    email: joi.string().regex(regexConstant.EMAIL).trim().required(),
    password: joi.string().regex(regexConstant.PASSWORD).trim().required(),
  });

  static update = joi.object({
    name: this.firstName,
    age: this.age,
    gender: this.gender,
  });
}
