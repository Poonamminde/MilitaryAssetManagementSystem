import Asset from "./asset.model";
import { IAssetDocument, ICreateAssetPayload, IUpdateAssetPayload } from "./asset.types";
import { NotFoundError, BadRequestError } from "../../utils/ApiError";

export class AssetService {
  /**
   * Get all assets
   */
  static async getAllAssets(): Promise<IAssetDocument[]> {
    return Asset.find().sort({ createdAt: -1 });
  }

  /**
   * Get available assets (for ordering)
   */
  static async getAvailableAssets(): Promise<IAssetDocument[]> {
    return Asset.find({ quantity: { $gt: 0 }, status: { $ne: "Decommissioned" } }).sort({
      name: 1,
    });
  }

  /**
   * Get asset by ID
   */
  static async getAssetById(assetId: string): Promise<IAssetDocument> {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      throw new NotFoundError("Asset not found");
    }
    return asset;
  }

  /**
   * Create a new asset
   */
  static async createAsset(
    payload: ICreateAssetPayload
  ): Promise<IAssetDocument> {
    const { name, type, quantity, specifications, description } = payload;

    if (!name || !type || quantity === undefined) {
      throw new BadRequestError("Name, type, and quantity are required");
    }

    const asset = await Asset.create({
      name,
      type,
      quantity,
      specifications: specifications || {},
      description: description || "",
    });

    return asset;
  }

  /**
   * Update an asset
   */
  static async updateAsset(
    assetId: string,
    payload: IUpdateAssetPayload
  ): Promise<IAssetDocument> {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      throw new NotFoundError("Asset not found");
    }

    Object.assign(asset, payload);
    await asset.save();
    return asset;
  }

  /**
   * Delete an asset
   */
  static async deleteAsset(assetId: string): Promise<void> {
    const asset = await Asset.findByIdAndDelete(assetId);
    if (!asset) {
      throw new NotFoundError("Asset not found");
    }
  }
}
