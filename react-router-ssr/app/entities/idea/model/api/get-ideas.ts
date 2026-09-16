import { api } from "~/shared/api";
import type { IdeaStatus } from "../types";
import type { IdeaApiResponse } from "./types";

export type IdeasSort = "createdAt" | "avgScore";

export type GetIdeasParams = {
  status?: IdeaStatus;
  sort?: IdeasSort;
};

export async function getIdeas(params?: GetIdeasParams): Promise<IdeaApiResponse[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) {
    searchParams.set("status", params.status);
  }
  if (params?.sort && params.sort !== "createdAt") {
    searchParams.set("sort", params.sort);
  }
  const query = searchParams.toString();
  const response = await api.get(query ? `ideas?${query}` : "ideas");
  return response.json<IdeaApiResponse[]>();
}
