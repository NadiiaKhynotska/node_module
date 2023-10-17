import { FilterQuery } from "mongoose";

import { User } from "../models";
import { IUser, IUserCredentials } from "../types";
import { IPaginationResponse } from "../types/pagination.types";
import { IQuery } from "../types/query.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async getAllWithPagination(
    queryObj: IQuery,
  ): Promise<IPaginationResponse<IUser>> {
    const {
      page = 1,
      sortedBy = "createdAt",
      limit = 5,
      ...searchObj
    } = queryObj;

    const skip = Number(limit) * (Number(page) - 1);

    const [users, itemsFound] = await Promise.all([
      User.find(searchObj).limit(Number(limit)).skip(skip).sort(sortedBy),
      User.count(searchObj),
    ]);

    return {
      page: Number(page),
      limit: Number(limit),
      itemsFound: itemsFound,
      data: users,
    };
  }

  public async findById(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async getOneByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser> {
    return await User.findOne(params, selection).lean();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }

  public async register(dto: IUserCredentials): Promise<IUser> {
    return await User.create(dto);
  }

  public async update(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async setStatus(userId: string, status: any): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { status } });
  }

  public async deleteOne(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }

  public async findWithoutActivityAfterDate(date: string): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: "tokens",
          localField: "_id",
          foreignField: "_userId",
          as: "tokens",
        },
      },
      {
        $match: {
          tokens: {
            $not: {
              $elemMatch: {
                createdAt: { $gte: date },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
        },
      },
    ]);
  }
}

export const userRepository = new UserRepository();
