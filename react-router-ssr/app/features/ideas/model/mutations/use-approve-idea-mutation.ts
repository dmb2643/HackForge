import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { ideasQueryKeys } from "~/entities/idea/model/query-keys";
import { approveIdea } from "~/features/ideas/model/api/approve-idea";

export function useApproveIdeaMutation(
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof approveIdea>>, Error, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveIdea,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ideasQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
  });
}
