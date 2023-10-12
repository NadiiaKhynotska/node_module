import { removeOldActionTokens } from "./delete-old-actionTokes.cron";
import { removeOldTokens } from "./delete-old-tokens.cron";

export const cronRunner = () => {
  removeOldTokens.start();
  removeOldActionTokens.start();
};
