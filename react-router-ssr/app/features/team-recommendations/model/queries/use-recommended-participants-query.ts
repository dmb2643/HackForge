import { useQuery } from "@tanstack/react-query";
import { teamsQueryKeys } from "~/entities/team/model/query-keys";
import { getRecommendedParticipants } from "../api/get-recommended-participants";

export function useRecommendedParticipantsQuery(teamId: string | undefined, enabled: boolean) {
  const id = teamId?.trim() ?? "";
  return useQuery({
    queryKey: teamsQueryKeys.recommended(id),
    queryFn: () => getRecommendedParticipants(id),
    enabled: Boolean(id) && enabled,
  });
}
