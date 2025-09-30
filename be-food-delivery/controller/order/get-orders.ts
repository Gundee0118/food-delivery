import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";
import { UserModel } from "../../model/users.model";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await FoodOrderModel.find()
      .populate({
        path: "user",
        select: "email",
        model: UserModel,
      })
      .populate({
        path: "foodOrderItems.food",
        select: "foodName image price",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders,
    });
    return;
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
    return;
  }
};
