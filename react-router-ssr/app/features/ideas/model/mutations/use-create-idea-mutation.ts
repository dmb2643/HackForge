import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateIdeaApiRequest, IdeaApiResponse } from "~/entities/idea";
import { createIdea, ideasMutationKeys, ideasQueryKeys } from "~/entities/idea";

type Options = Omit<
  UseMutationOptions<IdeaApiResponse, Error, CreateIdeaApiRequest>,
  "mutationFn" | "mutationKey"
>;

export function useCreateIdeaMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: ideasMutationKeys.create,
    mutationFn: createIdea,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ideasQueryKeys.all });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
