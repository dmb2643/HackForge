import { useQuery } from "@tanstack/react-query";
import { getTeam } from "~/entities/team/model/api/get-team";
import { teamsQueryKeys } from "~/entities/team/model/query-keys";

export function useTeamDetailQuery(teamId: string | undefined) {
  const id = teamId?.trim() ?? "";
  return useQuery({
    queryKey: teamsQueryKeys.detail(id),
    queryFn: () => getTeam(id),
    enabled: Boolean(id),
  });
}
