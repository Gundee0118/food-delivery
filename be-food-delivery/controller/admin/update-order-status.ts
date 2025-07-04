import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orders } = req.body;
  // console.log(orders, "ORDERS");
  try {
    await Promise.all(
      orders.map(async (order: Record<string, string>) => {
        await FoodOrderModel.findByIdAndUpdate(order._id, {
          status: order.status,
        });
      })
    );

    res.status(200).send({ message: "Success" });
  } catch (err) {
    // console.log(err, "hghghghgvghgvgh");
    res.status(500).json({ message: "Something went wrong" });
  }
};