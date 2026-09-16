import { api } from "~/shared/api";
import type { VoteIdeaApiRequest, VoteIdeaApiResponse } from "./types";

export async function voteIdea(
  ideaId: string,
  request: VoteIdeaApiRequest,
): Promise<VoteIdeaApiResponse> {
  const response = await api.post(`ideas/${ideaId}/vote`, { json: request });
  return response.json<VoteIdeaApiResponse>();
}
