import { Document, Types } from "mongoose";

export enum OrderStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  REJECTED = "Rejected",
}

export interface IOrderItem {
  asset: Types.ObjectId;
  quantity: number;
}

export interface ITrackingEntry {
  status: OrderStatus;
  timestamp: Date;
  updatedBy: Types.ObjectId;
  notes?: string;
}

export interface IOrder {
  orderedBy: Types.ObjectId;
  base: string;
  items: IOrderItem[];
  status: OrderStatus;
  trackingHistory: ITrackingEntry[];
  totalItems: number;
  notes?: string;
}

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrderPayload {
  items: Array<{
    asset: string;
    quantity: number;
  }>;
  notes?: string;
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
  notes?: string;
}
