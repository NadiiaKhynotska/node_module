import express, { Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import * as fsService from "./fs.service";
import { User } from "./models";
import { IUser } from "./types";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/users",
  async (_req: Request, res: Response): Promise<Response<IUser[]>> => {
    const users = await User.find();
    return res.json(users);
  },
);
app.post("/users", async (req, res) => {
  try {
    const createdUser = await User.create({ ...req.body });
    res.status(201).json(createdUser);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await fsService.reader();

    const user = users.find((user) => user.id === Number(id));
    if (!user) {
      throw new Error("user nor found");
    }
    res.json(user);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await fsService.reader();

    const index = users.findIndex((user) => user.id === Number(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    users.splice(index, 1);

    await fsService.writer(users);

    res.sendStatus(204);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, age, gender, email } = req.body;

    if (!name || name.length < 2) {
      throw new Error("incorrect name");
    }
    if (!age || age < 4) {
      throw new Error("invalid age");
    }
    if (!gender && gender !== "Female" && gender !== "Male") {
      throw new Error("invalid value of gender");
    }
    if (!email || !email.includes("@")) {
      throw new Error("invalid email");
    }

    const users = await fsService.reader();
    const user = users.find((user) => user.id === Number(id));

    if (!user) {
      throw new Error("User not found");
    }
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.email = email;

    await fsService.writer(users);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

const Port = 5001;

app.listen(Port, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`server has successfully started on port ${Port}`);
});
