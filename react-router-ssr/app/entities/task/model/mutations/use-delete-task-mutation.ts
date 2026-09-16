import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/delete-task";
import { tasksQueryKeys } from "../query-keys";

type Vars = { teamId: string; taskId: string };

type Options = Omit<UseMutationOptions<void, Error, Vars>, "mutationFn" | "mutationKey">;

export function useDeleteTaskMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: [...tasksQueryKeys.all, "delete"],
    mutationFn: ({ taskId }: Vars) => deleteTask(taskId),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byTeam(variables.teamId) });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
