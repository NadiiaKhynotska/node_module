import { removeOldActionTokens } from "./delete-old-actionTokes.cron";
import { removeOldTokens } from "./delete-old-tokens.cron";
import { sendNotificationToOldVisitors } from "./send-notification-old-visitors.cron";

export const cronRunner = () => {
  removeOldTokens.start();
  removeOldActionTokens.start();
  sendNotificationToOldVisitors.start();
};
