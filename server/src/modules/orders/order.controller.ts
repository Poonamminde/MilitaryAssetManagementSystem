import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { ICreateOrderPayload, IUpdateOrderStatusPayload } from "./order.types";
import { Role } from "../users/user.types";

export class OrderController {
  /**
   * POST /api/orders
   * Create a new order (Base Commander)
   */
  static async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as ICreateOrderPayload;
      const order = await OrderService.createOrder(req.user!, payload);
      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders
   * Get orders - filtered by role
   */
  static async getOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let orders;

      if (
        req.user!.role === Role.ADMIN ||
        req.user!.role === Role.LOGISTICS_OFFICER
      ) {
        // Admin and Logistics Officer can see all orders
        orders = await OrderService.getAllOrders();
      } else {
        // Base Commander sees only their own orders
        orders = await OrderService.getOrdersByUser(req.user!._id.toString());
      }

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id
   * Get a single order by ID
   */
  static async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/orders/:id/status
   * Update order status (Admin / Logistics Officer)
   */
  static async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload = req.body as IUpdateOrderStatusPayload;
      const order = await OrderService.updateOrderStatus(
        req.params.id,
        req.user!,
        payload
      );
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
