import { Router } from "express";
import { getOrders } from "../controller/order/get-orders";
import { getOrderByUserId } from "../controller/order/get-order-by-userId";
import { createOrder } from "../controller/order/create-order";
import { updateOrderState } from "../controller/order/update-order-state";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get all orders (admin only)
router.get("/getOrders", authMiddleware, getOrders);

// Get orders by user ID
router.get("/getOrder", getOrderByUserId);

// Create new order
router.post("/createOrder", createOrder);

// Update order state (admin only)
router.put("/updateOrderState/:orderId", authMiddleware, updateOrderState);

export { router as OrderRouter };
export default router;
