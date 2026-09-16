export const tasksQueryKeys = {
  all: ["tasks"] as const,
  byTeam: (teamId: string) => [...tasksQueryKeys.all, teamId] as const,
};

export const tasksMutationKeys = {
  all: [...tasksQueryKeys.all, "mutation"] as const,
};
