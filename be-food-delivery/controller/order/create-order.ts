import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";

export const createOrder = async (req: Request, res: Response) => {
  const { totalPrice, foodOrderItems, address, userId } = req.body;
  console.log(req.body);

  try {
    await FoodOrderModel.create({
      user: userId,
      totalPrice,
      foodOrderItems,
      address,
    });
    res.status(200).send({ message: "successfully created order " });
    return;
  } catch (err) {
    console.log(err);

    res.status(400).send({ message: "order uusgehed aldaa" });
    return;
  }
};
