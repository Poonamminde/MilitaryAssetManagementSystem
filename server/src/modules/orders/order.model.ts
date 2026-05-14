import mongoose, { Schema } from "mongoose";
import { IOrderDocument, OrderStatus } from "./order.types";

const orderItemSchema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const trackingEntrySchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrderDocument>(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must have a user"],
    },
    base: {
      type: String,
      required: [true, "Base is required"],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    trackingHistory: {
      type: [trackingEntrySchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total items before saving
orderSchema.pre<IOrderDocument>("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

const Order = mongoose.model<IOrderDocument>("Order", orderSchema);

export default Order;
