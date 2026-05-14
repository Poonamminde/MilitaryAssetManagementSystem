import api from "./api";
import { IApiResponse, IAsset } from "../types";

export interface ICreateAssetPayload {
  name: string;
  type: string;
  quantity: number;
  specifications?: Record<string, string | number>;
  description?: string;
}

export interface IUpdateAssetPayload {
  name?: string;
  type?: string;
  quantity?: number;
  specifications?: Record<string, string | number>;
  status?: string;
  description?: string;
}

export const assetService = {
  getAllAssets: async (): Promise<IApiResponse<IAsset[]>> => {
    const { data } = await api.get<IApiResponse<IAsset[]>>("/assets");
    return data;
  },

  getAvailableAssets: async (): Promise<IApiResponse<IAsset[]>> => {
    const { data } = await api.get<IApiResponse<IAsset[]>>("/assets/available");
    return data;
  },

  getAssetById: async (id: string): Promise<IApiResponse<IAsset>> => {
    const { data } = await api.get<IApiResponse<IAsset>>(`/assets/${id}`);
    return data;
  },

  createAsset: async (
    payload: ICreateAssetPayload
  ): Promise<IApiResponse<IAsset>> => {
    const { data } = await api.post<IApiResponse<IAsset>>("/assets", payload);
    return data;
  },

  updateAsset: async (
    id: string,
    payload: IUpdateAssetPayload
  ): Promise<IApiResponse<IAsset>> => {
    const { data } = await api.put<IApiResponse<IAsset>>(
      `/assets/${id}`,
      payload
    );
    return data;
  },

  deleteAsset: async (id: string): Promise<IApiResponse<null>> => {
    const { data } = await api.delete<IApiResponse<null>>(`/assets/${id}`);
    return data;
  },
};
