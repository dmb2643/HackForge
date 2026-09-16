import { api } from "~/shared/api";
import type { IdeaApiResponse } from "./types";

export async function submitIdeaForVoting(ideaId: string): Promise<IdeaApiResponse> {
  // Пустое JSON-тело: совпадает с Content-Type application/json и ожиданиями Spring
  const response = await api.post(`ideas/${ideaId}/submit-for-voting`, { json: {} });
  return response.json<IdeaApiResponse>();
}
