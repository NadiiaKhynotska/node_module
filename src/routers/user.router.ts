import { Router } from "express";

import { userController } from "../controllers";
import { userMiddleware } from "../middlewares";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators";

const router = Router();

export const userRouter = router;

router.get("", userController.getAll);

router.post(
  "",
  commonMiddleware.isBodyValid(UserValidator.create),
  userController.create,
);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.deleteById,
);

router.put(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateById,
);
