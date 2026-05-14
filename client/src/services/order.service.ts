import api from "./api";
import { IApiResponse, IOrder, OrderStatus } from "../types";

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

export const orderService = {
  getAllOrders: async (): Promise<IApiResponse<IOrder[]>> => {
    const { data } = await api.get<IApiResponse<IOrder[]>>("/orders");
    return data;
  },

  getOrderById: async (id: string): Promise<IApiResponse<IOrder>> => {
    const { data } = await api.get<IApiResponse<IOrder>>(`/orders/${id}`);
    return data;
  },

  createOrder: async (
    payload: ICreateOrderPayload
  ): Promise<IApiResponse<IOrder>> => {
    const { data } = await api.post<IApiResponse<IOrder>>("/orders", payload);
    return data;
  },

  updateOrderStatus: async (
    id: string,
    payload: IUpdateOrderStatusPayload
  ): Promise<IApiResponse<IOrder>> => {
    const { data } = await api.patch<IApiResponse<IOrder>>(
      `/orders/${id}/status`,
      payload
    );
    return data;
  },
};
