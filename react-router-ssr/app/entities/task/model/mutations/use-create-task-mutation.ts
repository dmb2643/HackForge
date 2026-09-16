import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateTaskBody, createTask } from "../api/create-task";
import { tasksQueryKeys } from "../query-keys";
import type { Task } from "../types";

type Vars = { teamId: string; body: CreateTaskBody };

type Options = Omit<UseMutationOptions<Task, Error, Vars>, "mutationFn" | "mutationKey">;

export function useCreateTaskMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: [...tasksQueryKeys.all, "create"],
    mutationFn: ({ teamId, body }: Vars) => createTask(teamId, body),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byTeam(variables.teamId) });
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
