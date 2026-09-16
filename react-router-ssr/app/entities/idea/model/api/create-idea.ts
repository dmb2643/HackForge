import { api } from "~/shared/api";
import type { CreateIdeaApiRequest, IdeaApiResponse } from "./types";

export async function createIdea(request: CreateIdeaApiRequest): Promise<IdeaApiResponse> {
  const response = await api.post("ideas", { json: request });
  return response.json<IdeaApiResponse>();
}
