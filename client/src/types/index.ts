// ─── User Types ──────────────────────────────────────────────────────────────

export enum Role {
  ADMIN = "Admin",
  BASE_COMMANDER = "Base Commander",
  LOGISTICS_OFFICER = "Logistics Officer",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  assignedBase: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Asset Types ─────────────────────────────────────────────────────────────

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
  _id: string;
  name: string;
  type: AssetType;
  quantity: number;
  specifications: IAssetSpecifications;
  status: AssetStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export enum OrderStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  REJECTED = "Rejected",
}

export interface IOrderItem {
  asset: {
    _id: string;
    name: string;
    type: string;
  };
  quantity: number;
}

export interface ITrackingEntry {
  status: OrderStatus;
  timestamp: string;
  updatedBy: {
    _id: string;
    name: string;
    role: string;
  };
  notes?: string;
}

export interface IOrder {
  _id: string;
  orderedBy: {
    _id: string;
    name: string;
    email: string;
    assignedBase: string;
  };
  base: string;
  items: IOrderItem[];
  status: OrderStatus;
  trackingHistory: ITrackingEntry[];
  totalItems: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  assignedBase: string;
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export interface INavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}
