import { Router } from "express";

import { userController } from "../controllers";
import { userMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators";

const router = Router();

export const userRouter = router;

router.get("", userController.getAll);

router.get("/me", authMiddleware.isAccessTokenValid, userController.getMe);

router.get(
  "/:userId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("userId"),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.delete(
  "/:userId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("userId"),
  userController.deleteById,
);

router.put(
  "/:userId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateById,
);
