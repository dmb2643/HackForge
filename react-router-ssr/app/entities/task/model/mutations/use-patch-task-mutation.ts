import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { type PatchTaskBody, patchTask } from "../api/patch-task";
import { tasksQueryKeys } from "../query-keys";
import type { Task } from "../types";

type Vars = { teamId: string; taskId: string; body: PatchTaskBody };

type Options = Omit<UseMutationOptions<Task, Error, Vars>, "mutationFn" | "mutationKey">;

export function usePatchTaskMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: [...tasksQueryKeys.all, "patch"],
    mutationFn: ({ taskId, body }: Vars) => patchTask(taskId, body),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byTeam(variables.teamId) });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
