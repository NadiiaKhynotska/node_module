import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { carRepository } from "../repositories";

class CarMiddleware {
  public async getByIdOrThrow(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const { carId } = req.params;

      const car = await carRepository.findById(carId);
      if (!car) {
        throw new ApiError("Car not found", 404);
      }

      req.res.locals = car;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const carMiddleware = new CarMiddleware();
