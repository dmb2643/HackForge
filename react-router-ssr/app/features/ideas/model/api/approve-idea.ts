import type { IdeaApiResponse } from "~/entities/idea/model/api/types";
import { api } from "~/shared/api";

export async function approveIdea(ideaId: string): Promise<IdeaApiResponse> {
  const response = await api.post(`ideas/${ideaId}/approve`);
  return response.json<IdeaApiResponse>();
}
