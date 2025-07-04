import { Router } from "express";

import { tokenChecker } from "../middleware/token-checker";
import { isAdmin } from "../middleware/authorization";
import { getAllOrders } from "../controller/admin/get-all-orders";
import { updateOrderStatus } from "../controller/admin/update-order-status";

export const AdminRouter = Router();

AdminRouter.get("/admin/getAllOrders", [tokenChecker, isAdmin], getAllOrders);
AdminRouter.put(
  "/admin/order/update",
  [tokenChecker, isAdmin],
  updateOrderStatus
);
