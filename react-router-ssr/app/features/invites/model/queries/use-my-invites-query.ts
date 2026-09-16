import { useQuery } from "@tanstack/react-query";
import { getMyInvites } from "~/features/invites/model/api/get-my-invites";
import { invitesQueryKeys } from "~/features/invites/model/query-keys";

export function useMyInvitesQuery() {
  return useQuery({
    queryKey: invitesQueryKeys.my(),
    queryFn: getMyInvites,
  });
}
