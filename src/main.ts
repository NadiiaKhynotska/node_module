import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { ApiError } from "./errors";
import { User } from "./models";
import { IUser } from "./types";
import { UserValidator } from "./validators";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/users",
  async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  },
);
app.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { value, error } = UserValidator.create.validate(req.body);
      const createdUser = await User.create(value);

      if (error) {
        throw new ApiError(error.message, 400);
      }
      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError("invalid id", 400);
      }
      const user = await User.findById(id);
      if (!user) {
        throw new ApiError("user nor found", 404);
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
);

app.delete(
  "/users/:id",
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

app.put(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json(err.message);
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`server has successfully started on port ${configs.PORT}`);
});
