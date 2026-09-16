import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveTeam } from "~/entities/team/model/api/leave-team";
import { teamsMutationKeys, teamsQueryKeys } from "~/entities/team/model/query-keys";
import { invitesQueryKeys } from "~/features/invites/model/query-keys";

const profileQueryKey = ["profile"] as const;
const participantsQueryKey = ["participants"] as const;

type Options = Omit<UseMutationOptions<void, Error, string>, "mutationFn" | "mutationKey">;

export function useLeaveTeamMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: teamsMutationKeys.leave,
    mutationFn: leaveTeam,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: participantsQueryKey });
      await queryClient.invalidateQueries({ queryKey: invitesQueryKeys.my() });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
