import { api } from "~/shared/api";
import type { RecommendedParticipant } from "../types";

export async function getRecommendedParticipants(
  teamId: string,
): Promise<RecommendedParticipant[]> {
  return api.get(`teams/${teamId}/recommended-participants`).json<RecommendedParticipant[]>();
}
