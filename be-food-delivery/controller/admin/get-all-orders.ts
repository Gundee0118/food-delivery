import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";

export const getAllOrders = async (_req: Request, res: Response) => {
  const { userId } = res.locals;
  if (!userId) {
    res.status(400).send("userID is not found");
  }

  try {
    const allOrders = await FoodOrderModel.find({})
      .populate({
        path: "foodOrderItems",
        populate: {
          path: "food",
          model: "Foods",
        },
      })
      .populate("user");
    res.status(200).send({ orders: allOrders });
  } catch (err) {
    res.status(400).send({ message: "cannot get orders" });
  }
};
