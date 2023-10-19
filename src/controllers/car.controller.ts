import { NextFunction, Request, Response } from "express";

import { carService } from "../services";
import { ICar } from "../types";
import { ITokenPayload } from "../types/token.type";

class CarController {
  public async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
    try {
      const cars = await carService.getAll();
      return res.json(cars);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const car = req.res.locals;
      res.json(car);
    } catch (e) {
      next(e);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      const createdCar = await carService.create(req.body, userId);
      res.status(201).json(createdCar);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      await carService.deleteOne(req.params.carId, userId);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      const updatedCar = await carService.update(
        req.params.carId,
        req.body,
        userId,
      );

      res.status(201).json(updatedCar);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();
