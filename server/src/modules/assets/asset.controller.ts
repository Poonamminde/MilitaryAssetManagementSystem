import { Request, Response, NextFunction } from "express";
import { AssetService } from "./asset.service";
import { ICreateAssetPayload, IUpdateAssetPayload } from "./asset.types";

export class AssetController {
  /**
   * GET /api/assets
   * Get all assets
   */
  static async getAllAssets(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const assets = await AssetService.getAllAssets();
      res.status(200).json({
        success: true,
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/assets/available
   * Get available assets for ordering
   */
  static async getAvailableAssets(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const assets = await AssetService.getAvailableAssets();
      res.status(200).json({
        success: true,
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/assets/:id
   * Get asset by ID
   */
  static async getAssetById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const asset = await AssetService.getAssetById(req.params.id);
      res.status(200).json({
        success: true,
        data: asset,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/assets
   * Create a new asset (Admin only)
   */
  static async createAsset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as ICreateAssetPayload;
      const asset = await AssetService.createAsset(payload);
      res.status(201).json({
        success: true,
        message: "Asset created successfully",
        data: asset,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/assets/:id
   * Update an asset (Admin only)
   */
  static async updateAsset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as IUpdateAssetPayload;
      const asset = await AssetService.updateAsset(req.params.id, payload);
      res.status(200).json({
        success: true,
        message: "Asset updated successfully",
        data: asset,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/assets/:id
   * Delete an asset (Admin only)
   */
  static async deleteAsset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AssetService.deleteAsset(req.params.id);
      res.status(200).json({
        success: true,
        message: "Asset deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
