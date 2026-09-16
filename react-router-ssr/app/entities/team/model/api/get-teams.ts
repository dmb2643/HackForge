import { api } from "~/shared/api";
import type { TeamApiResponse } from "./types";

export async function getTeams(): Promise<TeamApiResponse[]> {
  const response = await api.get("teams");
  return response.json<TeamApiResponse[]>();
}
