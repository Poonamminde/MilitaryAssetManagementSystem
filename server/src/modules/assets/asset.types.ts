import { Document, Types } from "mongoose";

export enum AssetType {
  VEHICLE = "Vehicle",
  WEAPON = "Weapon",
  EQUIPMENT = "Equipment",
  AMMUNITION = "Ammunition",
  COMMUNICATION = "Communication",
}

export enum AssetStatus {
  AVAILABLE = "Available",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock",
  DECOMMISSIONED = "Decommissioned",
}

export interface IAssetSpecifications {
  weight?: string;
  dimensions?: string;
  manufacturer?: string;
  yearOfManufacture?: number;
  caliber?: string;
  range?: string;
  capacity?: string;
  fuelType?: string;
  [key: string]: string | number | undefined;
}

export interface IAsset {
  name: string;
  type: AssetType;
  quantity: number;
  specifications: IAssetSpecifications;
  status: AssetStatus;
  description: string;
}

export interface IAssetDocument extends IAsset, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAssetPayload {
  name: string;
  type: AssetType;
  quantity: number;
  specifications?: IAssetSpecifications;
  description?: string;
}

export interface IUpdateAssetPayload {
  name?: string;
  type?: AssetType;
  quantity?: number;
  specifications?: IAssetSpecifications;
  status?: AssetStatus;
  description?: string;
}
