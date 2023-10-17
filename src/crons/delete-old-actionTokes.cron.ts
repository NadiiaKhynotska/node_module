import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors";
import { actionTokenRepository } from "../repositories/action-token.repository";

dayjs.extend(utc);

const actionTokenRemover = async function () {
  try {
    const prevMonth = dayjs().utc().subtract(30, "d");

    await actionTokenRepository.deleteManyByParams({
      createdAt: { $lte: prevMonth },
    });
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const removeOldActionTokens = new CronJob(
  "0 0 * * *",
  actionTokenRemover,
);
