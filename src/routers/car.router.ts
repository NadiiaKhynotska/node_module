import { Router } from "express";

import { carController } from "../controllers";
import { carMiddleware, commonMiddleware } from "../middlewares";
import { CarValidator } from "../validators";

const router = Router();

export const carRouter = router;

router.get("", carController.getAll);

router.post(
  "",
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.create,
);

router.get(
  "/:carId",
  commonMiddleware.isValidId("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);

router.delete(
  "/:carId",
  commonMiddleware.isValidId("carId"),
  carController.deleteById,
);

router.put(
  "/:carId",
  commonMiddleware.isValidId("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateById,
);
