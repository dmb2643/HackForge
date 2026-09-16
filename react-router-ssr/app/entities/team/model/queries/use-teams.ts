import { useQuery } from "@tanstack/react-query";
import { mapTeamApiToTeamCardData } from "~/entities/team/lib/map-team-api-to-card";
import { getTeams } from "~/entities/team/model/api/get-teams";
import { teamsQueryKeys } from "~/entities/team/model/query-keys";

export function useTeamsQuery() {
  return useQuery({
    queryKey: teamsQueryKeys.list(),
    queryFn: async () => {
      const list = await getTeams();
      return list.map(mapTeamApiToTeamCardData);
    },
  });
}
