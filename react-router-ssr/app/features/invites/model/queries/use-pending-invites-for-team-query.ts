import { useQuery } from "@tanstack/react-query";
import { getPendingInvitesForTeam } from "~/features/invites/model/api/get-pending-for-team";
import { invitesQueryKeys } from "~/features/invites/model/query-keys";

export function usePendingInvitesForTeamQuery(teamId: string | undefined) {
  const id = teamId?.trim() ?? "";
  return useQuery({
    queryKey: invitesQueryKeys.pendingForTeam(id),
    queryFn: () => getPendingInvitesForTeam(id),
    enabled: Boolean(id),
  });
}
