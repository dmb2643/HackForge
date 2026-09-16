import type { CreateTeamApiRequest, TeamApiResponse } from "~/entities/team/model/api/types";
import { api } from "~/shared/api";

export const createTeam = async (request: CreateTeamApiRequest): Promise<TeamApiResponse> => {
  const response = await api.post("teams", { json: request });
  return response.json<TeamApiResponse>();
};
