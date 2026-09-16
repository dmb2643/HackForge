import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VoteIdeaApiRequest, VoteIdeaApiResponse } from "~/entities/idea";
import { ideasMutationKeys, ideasQueryKeys, voteIdea } from "~/entities/idea";

type VoteVariables = {
  ideaId: string;
  request: VoteIdeaApiRequest;
};

type Options = Omit<
  UseMutationOptions<VoteIdeaApiResponse, Error, VoteVariables>,
  "mutationFn" | "mutationKey"
>;

export function useVoteIdeaMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: ideasMutationKeys.vote,
    mutationFn: ({ ideaId, request }: VoteVariables) => voteIdea(ideaId, request),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ideasQueryKeys.all });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
