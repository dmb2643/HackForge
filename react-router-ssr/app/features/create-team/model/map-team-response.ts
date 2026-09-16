import { mapTeamApiToTeamCardDataWithExtras } from "~/entities/team/lib/map-team-api-to-card";
import type { TeamApiResponse } from "~/entities/team/model/api/types";
import type { TeamRole } from "~/entities/team/model/types";

export function mapTeamApiResponseToCardData(
  response: TeamApiResponse,
  extras: { track: string; openRoles: TeamRole[] },
) {
  return mapTeamApiToTeamCardDataWithExtras(response, extras);
}
