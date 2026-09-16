import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { InviteToTeamApiResponse } from "~/entities/team/model/api/types";
import { teamsMutationKeys, teamsQueryKeys } from "~/entities/team/model/query-keys";
import {
  type InviteUserToTeamParams,
  inviteUserToTeam,
} from "~/features/team-invite/model/api/invite-user-to-team";

type Options = Omit<
  UseMutationOptions<InviteToTeamApiResponse, Error, InviteUserToTeamParams>,
  "mutationFn" | "mutationKey"
>;

export function useInviteUserToTeamMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: teamsMutationKeys.invite,
    mutationFn: inviteUserToTeam,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.list() });
      await queryClient.invalidateQueries({
        queryKey: teamsQueryKeys.recommended(variables.teamId),
      });
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.detail(variables.teamId) });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
