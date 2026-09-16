import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { ideasQueryKeys } from "~/entities/idea/model/query-keys";
import { startIdea } from "~/features/ideas/model/api/start-idea";

export function useStartIdeaMutation(
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof startIdea>>, Error, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startIdea,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ideasQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
  });
}
