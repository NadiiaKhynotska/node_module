import { ApiError } from "../errors";
import { carRepository } from "../repositories";
import { ICar } from "../types";

class CarService {
  public async getAll(): Promise<ICar[]> {
    return await carRepository.getAll();
  }

  public async create(dto: ICar, userId: string) {
    return await carRepository.create(dto, userId);
  }

  public async update(
    carId: string,
    dto: Partial<ICar>,
    userId: string,
  ): Promise<ICar> {
    await this.checkAbilityToManage(userId, carId);
    return await carRepository.update(carId, dto);
  }

  public async deleteOne(carId: string, userId: string): Promise<void> {
    await this.checkAbilityToManage(userId, carId);
    await carRepository.deleteOne(carId);
  }

  private async checkAbilityToManage(
    userId: string,
    manageCarId: string,
  ): Promise<ICar> {
    const car = await carRepository.getOneByParams({
      _userId: userId,
      _id: manageCarId,
    });
    if (!car) {
      throw new ApiError("You can not manage this car", 403);
    }
    return car;
  }
}

export const carService = new CarService();
