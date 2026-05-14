import mongoose, { Schema } from "mongoose";
import { IAssetDocument, AssetType, AssetStatus } from "./asset.types";

const assetSchema = new Schema<IAssetDocument>(
  {
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: [100, "Asset name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: Object.values(AssetType),
      required: [true, "Asset type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: Object.values(AssetStatus),
      default: AssetStatus.AVAILABLE,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update status based on quantity
assetSchema.pre<IAssetDocument>("save", function (next) {
  if (this.quantity === 0) {
    this.status = AssetStatus.OUT_OF_STOCK;
  } else if (this.quantity <= 10) {
    this.status = AssetStatus.LOW_STOCK;
  } else if (this.status !== AssetStatus.DECOMMISSIONED) {
    this.status = AssetStatus.AVAILABLE;
  }
  next();
});

const Asset = mongoose.model<IAssetDocument>("Asset", assetSchema);

export default Asset;
