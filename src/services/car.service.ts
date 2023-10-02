import { carRepository } from "../repositories";
import { ICar } from "../types";

class CarService {
  public async getAll(): Promise<ICar[]> {
    return await carRepository.getAll();
  }

  public async create(dto: ICar) {
    return await carRepository.create(dto);
  }

  public async update(carId: string, dto: Partial<ICar>): Promise<ICar> {
    return await carRepository.update(carId, dto);
  }

  public async deleteOne(carId: string): Promise<void> {
    await carRepository.deleteOne(carId);
  }
}

export const carService = new CarService();
