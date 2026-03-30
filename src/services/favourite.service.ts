/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface IFavourite {
  id: string;
  userId: string;
  ideaId: string;
  createdAt: string;
}

export interface IToggleFavouritePayload {
  ideaId: string;
}

export interface IToggleFavouriteResponse {
  action: "ADDED" | "REMOVED";
  favourite: IFavourite | null;
}

// Toggle favourite status for an idea
export const toggleFavourite = async (
  payload: IToggleFavouritePayload
): Promise<ApiResponse<IToggleFavouriteResponse>> => {
  return httpClient.post<IToggleFavouriteResponse>("/favourites", payload);
};

// Get user's favourite ideas
export const getMyFavourites = async (): Promise<
  ApiResponse<{ ideaId: string }[]>
> => {
  return httpClient.get<{ ideaId: string }[]>("/favourites/my-favourites");
};
