import type { IdeaApiResponse } from "~/entities/idea/model/api/types";
import { api } from "~/shared/api";

export async function startIdea(ideaId: string): Promise<IdeaApiResponse> {
  const response = await api.post(`ideas/${ideaId}/start`);
  return response.json<IdeaApiResponse>();
}
