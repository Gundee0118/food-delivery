//get-order-by-userId dotor ene iig bichnee                                            import { Request, Response } from "express";
import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.query;
  console.log(userId, "userid");

  try {
    const allOrderByUserId = await FoodOrderModel.find({
      user: userId,
    }).populate({
      path: "foodOrderItems",
      populate: {
        path: "food",
        model: "Foods",
      },
    });
    res.status(200).send({ orders: allOrderByUserId });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Cannot get order" });
  }
};
