import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IdeaApiResponse } from "~/entities/idea";
import { ideasMutationKeys, ideasQueryKeys, submitIdeaForVoting } from "~/entities/idea";

type Options = Omit<
  UseMutationOptions<IdeaApiResponse, Error, string>,
  "mutationFn" | "mutationKey"
>;

export function useSubmitIdeaForVotingMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: ideasMutationKeys.submitForVoting,
    mutationFn: (ideaId: string) => submitIdeaForVoting(ideaId),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ideasQueryKeys.all });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
