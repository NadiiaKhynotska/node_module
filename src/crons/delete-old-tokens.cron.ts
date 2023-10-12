import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors";
import { tokenRepository } from "../repositories/token.repository";

dayjs.extend(utc);

const tokenRemover = async function () {
  try {
    const prevMonth = dayjs().utc().subtract(30, "d");

    await tokenRepository.deleteManyByParams({
      createdAt: { $lte: prevMonth },
    });
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const removeOldTokens = new CronJob(" 0 0 * * *", tokenRemover);
