"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IIdea } from "@/types/idea.types";
import { cookies } from "next/headers";

export interface IFavourite {
  id: string;
  userId: string;
  ideaId: string;
  idea?: IIdea;
  createdAt: string;
}

export interface IToggleFavouritePayload {
  ideaId: string;
}

export interface IToggleFavouriteResponse {
  action: "ADDED" | "REMOVED";
  favourite: IFavourite | null;
}

const getCookieHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
  if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

  return {
    Cookie: cookieParts.join("; "),
  };
};

// Toggle favourite status for an idea
export const toggleFavourite = async (
  payload: IToggleFavouritePayload
): Promise<ApiResponse<IToggleFavouriteResponse>> => {
  const headers = await getCookieHeaders();
  return httpClient.post<IToggleFavouriteResponse>("/favourites", payload, { headers });
};

// Get user's favourite ideas
export const getMyFavourites = async (): Promise<
  ApiResponse<IFavourite[]>
> => {
  const headers = await getCookieHeaders();
  return httpClient.get<IFavourite[]>("/favourites/my-favourites", { headers });
};

