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
    await mongoose.connect(
      "mongodb+srv://eternalbeat89:Gundee18@cluster0.qkuh2qr.mongodb.net/foodDelivery"
    );
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

server.listen(8000, () => {
  console.log(`running on http://localhost:8000`);
});
