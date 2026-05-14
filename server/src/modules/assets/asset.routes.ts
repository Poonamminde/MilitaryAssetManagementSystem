import { Router } from "express";
import { AssetController } from "./asset.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { Role } from "../users/user.types";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/assets/available - All authenticated users
router.get("/available", AssetController.getAvailableAssets);

// GET /api/assets - Admin only (full list including decommissioned)
router.get("/", authorize(Role.ADMIN), AssetController.getAllAssets);

// GET /api/assets/:id - All authenticated users
router.get("/:id", AssetController.getAssetById);

// POST /api/assets - Admin only
router.post("/", authorize(Role.ADMIN), AssetController.createAsset);

// PUT /api/assets/:id - Admin only
router.put("/:id", authorize(Role.ADMIN), AssetController.updateAsset);

// DELETE /api/assets/:id - Admin only
router.delete("/:id", authorize(Role.ADMIN), AssetController.deleteAsset);

export default router;
