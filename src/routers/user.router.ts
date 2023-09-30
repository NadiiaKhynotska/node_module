import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";

import { userController } from "../controllers";
import { ApiError } from "../errors";
import { userMiddleware } from "../middlewares";
import { commonMiddleware } from "../middlewares/common.middleware";
import { User } from "../models";
import { UserValidator } from "../validators";

const router = Router();

export const userRouter = router;
router.get("", userController.getAll);
router.post(
  "",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { value, error } = UserValidator.create.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const createdUser = await User.create(value);
      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/:id",
  commonMiddleware.isValidId,
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError("invalid id", 400);
      }
      const { deletedCount } = await User.deleteOne({ _id: id });

      if (!deletedCount) {
        throw new ApiError("User not found", 404);
      }
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
);

router.put(":id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      throw new ApiError("invalid id", 400);
    }
    const { error, value } = UserValidator.update.validate(req.body);
    if (error) {
      throw new ApiError(error.message, 400);
    }

    const updatedUser = await User.findByIdAndUpdate(id, value, {
      returnDocument: "after",
    });

    if (!updatedUser) {
      throw new ApiError("User not found", 404);
    }

    res.status(201).json(updatedUser);
  } catch (e) {
    next(e);
  }
});
