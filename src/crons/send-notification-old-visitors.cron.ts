import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EEmailAction } from "../enums/EEmailAction";
import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { emailService } from "../services/email.service";

dayjs.extend(utc);

const sendNotification = async function () {
  try {
    const date = dayjs().utc().subtract(1, "d");
    const users = await userRepository.findWithoutActivityAfterDate(
      date.toISOString(),
    );
    await Promise.all([
      users.map(async (user) => {
        await emailService.sendMail(user.email, EEmailAction.OLD_VISITORS, {
          name: user.name,
        });
      }),
    ]);
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const sendNotificationToOldVisitors = new CronJob(
  "0 0 * * *",
  sendNotification,
);
