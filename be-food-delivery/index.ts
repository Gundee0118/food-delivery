import express, { request, Request, Response } from "express";
import mongoose, { Schema, model } from "mongoose";
import cors from "cors";
import { UserRouter } from "./router/user.route";
import { CategoryRouter } from "./router/category.route";
import { FoodRouter } from "./router/food.route";
import { OrderRouter } from "./router/order.route";
import { AdminRouter } from "./router/admin.route";
//gvjn ooen sird sjkp

const databaseConnect = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb+srv://eternalbeat89:Gundee18@cluster0.qkuh2qr.mongodb.net/foodDelivery";
    await mongoose.connect(mongoUri);
    console.log("successfully db connected");
  } catch (err) {
    console.log(err);
    throw new Error("database assangui");
  }
};

const server = express();
server.use(express.json());
server.use(cors());
databaseConnect();

server.use(UserRouter);
server.use(CategoryRouter);
server.use(FoodRouter);
server.use(OrderRouter);
server.use(AdminRouter);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
