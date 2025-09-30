import { Request, Response } from "express";
import { FoodOrderModel } from "../../model/order.model";

export const updateOrderState = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { deliveryState } = req.body;

    if (
      !deliveryState ||
      !["Pending", "Delivered", "Cancelled"].includes(deliveryState)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid delivery state",
      });
      return;
    }

    const order = await FoodOrderModel.findByIdAndUpdate(
      orderId,
      { status: deliveryState },
      { new: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order state updated successfully",
      order: order,
    });
    return;
  } catch (error) {
    console.error("Error updating order state:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order state",
    });
    return;
  }
};
