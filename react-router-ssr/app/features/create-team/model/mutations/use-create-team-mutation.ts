import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsMutationKeys, teamsQueryKeys } from "~/entities/team/model/query-keys";
import { createTeam } from "../api/create-team";
import type { CreateTeamApiRequest, TeamApiResponse } from "../types";

type CreateTeamMutationOptions = Omit<
  UseMutationOptions<TeamApiResponse, Error, CreateTeamApiRequest>,
  "mutationFn" | "mutationKey"
>;

export function useCreateTeamMutation(options?: CreateTeamMutationOptions) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: teamsMutationKeys.create,
    mutationFn: createTeam,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.list() });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
