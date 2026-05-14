import api from "./api";
import { IApiResponse, IUser, Role } from "../types";

export const userService = {
  getAllUsers: async (): Promise<IApiResponse<IUser[]>> => {
    const { data } = await api.get<IApiResponse<IUser[]>>("/users");
    return data;
  },

  getUserById: async (id: string): Promise<IApiResponse<IUser>> => {
    const { data } = await api.get<IApiResponse<IUser>>(`/users/${id}`);
    return data;
  },

  updateUserRole: async (
    id: string,
    role: Role
  ): Promise<IApiResponse<IUser>> => {
    const { data } = await api.patch<IApiResponse<IUser>>(`/users/${id}/role`, {
      role,
    });
    return data;
  },
};
