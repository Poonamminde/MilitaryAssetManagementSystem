import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { Role } from "../users/user.types";

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/orders - Base Commander only
router.post(
  "/",
  authorize(Role.BASE_COMMANDER),
  OrderController.createOrder
);

// GET /api/orders - All roles (filtered by role in controller)
router.get(
  "/",
  authorize(Role.ADMIN, Role.BASE_COMMANDER, Role.LOGISTICS_OFFICER),
  OrderController.getOrders
);

// GET /api/orders/:id - All roles
router.get(
  "/:id",
  authorize(Role.ADMIN, Role.BASE_COMMANDER, Role.LOGISTICS_OFFICER),
  OrderController.getOrderById
);

// PATCH /api/orders/:id/status - Admin & Logistics Officer only
router.patch(
  "/:id/status",
  authorize(Role.ADMIN, Role.LOGISTICS_OFFICER),
  OrderController.updateOrderStatus
);

export default router;
