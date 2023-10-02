import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { carRouter, userRouter } from "./routers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json(err.message);
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`server has successfully started on port ${configs.PORT}`);
});
