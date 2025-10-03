import express, { request, Request, Response } from "express";
import mongoose, { Schema, model } from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
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
server.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost and all Vercel domains
      if (origin.includes("localhost") || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
databaseConnect();

server.use(UserRouter);
server.use(CategoryRouter);
server.use(FoodRouter);
server.use(OrderRouter);
server.use(AdminRouter);

const httpServer = createServer(server);
export const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.includes("localhost") || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});
