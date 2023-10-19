import { Router } from "express";

import { carController } from "../controllers";
import { carMiddleware, commonMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CarValidator } from "../validators";

const router = Router();

export const carRouter = router;

router.get("", carController.getAll);

router.post(
  "",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create,
);

router.get(
  "/:carId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);

router.delete(
  "/:carId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("carId"),
  carController.deleteById,
);

router.put(
  "/:carId",
  authMiddleware.isAccessTokenValid,
  commonMiddleware.isValidId("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateById,
);
