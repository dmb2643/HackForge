import { api } from "~/shared/api";
import type { TeamApiResponse } from "./types";

export async function getTeam(teamId: string): Promise<TeamApiResponse> {
  const response = await api.get(`teams/${teamId}`);
  return response.json<TeamApiResponse>();
}
