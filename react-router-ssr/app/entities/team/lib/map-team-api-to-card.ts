import type { TeamApiResponse } from "~/entities/team/model/api/types";
import type { TeamCardData, TeamRole } from "~/entities/team/model/types";

const DEFAULT_MAX_MEMBERS = 5;
const DEFAULT_TRACK = "—";

/** Карточка доски из ответа GET /teams (без track/open roles с бэкенда). */
export function mapTeamApiToTeamCardData(response: TeamApiResponse): TeamCardData {
  return {
    id: response.id,
    name: response.name,
    captainId: response.captainId,
    description: response.description ?? "",
    track: DEFAULT_TRACK,
    openRoles: [],
    techStack: [],
    members: response.members.map((m) => ({
      id: m.id,
      name: m.name,
    })),
    maxMembers: DEFAULT_MAX_MEMBERS,
    isBookmarked: false,
  };
}

/** После POST /teams с формой — подставляем track и роли из UI. */
export function mapTeamApiToTeamCardDataWithExtras(
  response: TeamApiResponse,
  extras: { track: string; openRoles: TeamRole[] },
): TeamCardData {
  return {
    ...mapTeamApiToTeamCardData(response),
    track: extras.track,
    openRoles: extras.openRoles,
  };
}
