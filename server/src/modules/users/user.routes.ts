import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { Role } from "./user.types";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users - Admin only
router.get("/", authorize(Role.ADMIN), UserController.getAllUsers);

// GET /api/users/:id - Admin only
router.get("/:id", authorize(Role.ADMIN), UserController.getUserById);

// PATCH /api/users/:id/role - Admin only
router.patch("/:id/role", authorize(Role.ADMIN), UserController.updateUserRole);

export default router;
