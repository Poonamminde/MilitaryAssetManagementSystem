import Order from "./order.model";
import Asset from "../assets/asset.model";
import {
  IOrderDocument,
  ICreateOrderPayload,
  IUpdateOrderStatusPayload,
  OrderStatus,
} from "./order.types";
import { IUserDocument } from "../users/user.types";
import { NotFoundError, BadRequestError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class OrderService {
  /**
   * Create a new order (Base Commander)
   */
  static async createOrder(
    user: IUserDocument,
    payload: ICreateOrderPayload
  ): Promise<IOrderDocument> {
    const { items, notes } = payload;

    if (!items || items.length === 0) {
      throw new BadRequestError("Order must contain at least one item");
    }

    // Validate assets exist and have sufficient quantity
    for (const item of items) {
      const asset = await Asset.findById(item.asset);
      if (!asset) {
        throw new NotFoundError(`Asset with ID ${item.asset} not found`);
      }
      if (asset.quantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for ${asset.name}. Available: ${asset.quantity}, Requested: ${item.quantity}`
        );
      }
    }

    const order = await Order.create({
      orderedBy: user._id,
      base: user.assignedBase,
      items: items.map((item) => ({
        asset: new mongoose.Types.ObjectId(item.asset),
        quantity: item.quantity,
      })),
      status: OrderStatus.PENDING,
      notes: notes || "",
      trackingHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(),
          updatedBy: user._id,
          notes: "Order placed",
        },
      ],
    });

    return order.populate([
      { path: "items.asset", select: "name type" },
      { path: "orderedBy", select: "name email assignedBase" },
    ]);
  }

  /**
   * Get orders for a specific user (Base Commander)
   */
  static async getOrdersByUser(userId: string): Promise<IOrderDocument[]> {
    return Order.find({ orderedBy: userId })
      .populate("items.asset", "name type")
      .populate("orderedBy", "name email assignedBase")
      .populate("trackingHistory.updatedBy", "name role")
      .sort({ createdAt: -1 });
  }

  /**
   * Get all orders (Admin / Logistics Officer)
   */
  static async getAllOrders(): Promise<IOrderDocument[]> {
    return Order.find()
      .populate("items.asset", "name type")
      .populate("orderedBy", "name email assignedBase")
      .populate("trackingHistory.updatedBy", "name role")
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single order by ID
   */
  static async getOrderById(orderId: string): Promise<IOrderDocument> {
    const order = await Order.findById(orderId)
      .populate("items.asset", "name type")
      .populate("orderedBy", "name email assignedBase")
      .populate("trackingHistory.updatedBy", "name role");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }

  /**
   * Update order status (Logistics Officer / Admin)
   * Also deducts asset quantities when an order is approved
   */
  static async updateOrderStatus(
    orderId: string,
    user: IUserDocument,
    payload: IUpdateOrderStatusPayload
  ): Promise<IOrderDocument> {
    const { status, notes } = payload;

    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestError("Invalid order status");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.REJECTED],
      [OrderStatus.APPROVED]: [OrderStatus.DISPATCHED, OrderStatus.REJECTED],
      [OrderStatus.DISPATCHED]: [OrderStatus.IN_TRANSIT],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.REJECTED]: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestError(
        `Cannot transition from '${order.status}' to '${status}'`
      );
    }

    // Deduct asset quantities when order is approved
    if (status === OrderStatus.APPROVED) {
      for (const item of order.items) {
        const asset = await Asset.findById(item.asset);
        if (!asset) {
          throw new NotFoundError(`Asset not found for order item`);
        }
        if (asset.quantity < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${asset.name}. Available: ${asset.quantity}, Requested: ${item.quantity}`
          );
        }
        asset.quantity -= item.quantity;
        await asset.save();
      }
    }

    // Update status and add tracking entry
    order.status = status;
    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: user._id,
      notes: notes || `Status updated to ${status}`,
    });

    await order.save();

    return order.populate([
      { path: "items.asset", select: "name type" },
      { path: "orderedBy", select: "name email assignedBase" },
      { path: "trackingHistory.updatedBy", select: "name role" },
    ]);
  }
}
