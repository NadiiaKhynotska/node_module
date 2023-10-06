import { EEmailAction } from "../enums/EEmailAction";

export const template = {
  [EEmailAction.REGISTER]: {
    templateName: "register",
    subject: "Welcome to our amazing app",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Your email password ander control",
  },
};
