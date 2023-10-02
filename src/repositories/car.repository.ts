import { FilterQuery } from "mongoose";

import { Car } from "../models";
import { ICar } from "../types";

class CarRepository {
  public async getAll(): Promise<ICar[]> {
    return await Car.find();
  }

  public async findById(id: string): Promise<ICar> {
    return await Car.findById(id);
  }

  public async getOneByParams(params: FilterQuery<ICar>): Promise<any> {
    return await Car.findOne(params);
  }

  public async create(dto: ICar): Promise<any> {
    return await Car.create(dto);
  }

  public async update(carId: string, dto: Partial<ICar>): Promise<ICar> {
    return await Car.findByIdAndUpdate(carId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteOne(carId: string): Promise<void> {
    await Car.deleteOne({ _id: carId });
  }
}

export const carRepository = new CarRepository();
