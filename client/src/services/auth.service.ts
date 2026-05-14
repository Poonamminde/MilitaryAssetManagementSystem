import api from "./api";
import { IApiResponse, IUser, ILoginPayload, IRegisterPayload } from "../types";

export const authService = {
  login: async (payload: ILoginPayload): Promise<IApiResponse<IUser>> => {
    const { data } = await api.post<IApiResponse<IUser>>("/auth/login", payload);
    return data;
  },

  register: async (payload: IRegisterPayload): Promise<IApiResponse<IUser>> => {
    const { data } = await api.post<IApiResponse<IUser>>("/auth/register", payload);
    return data;
  },

  getMe: async (): Promise<IApiResponse<IUser>> => {
    const { data } = await api.get<IApiResponse<IUser>>("/auth/me");
    return data;
  },

  logout: async (): Promise<IApiResponse<null>> => {
    const { data } = await api.post<IApiResponse<null>>("/auth/logout");
    return data;
  },
};
