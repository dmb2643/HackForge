export const teamsQueryKeys = {
  all: ["teams"] as const,
  list: () => [...teamsQueryKeys.all, "list"] as const,
  detail: (teamId: string) => [...teamsQueryKeys.all, "detail", teamId] as const,
  recommended: (teamId: string) => [...teamsQueryKeys.all, "recommended", teamId] as const,
};

export const teamsMutationKeys = {
  create: [...teamsQueryKeys.all, "create"] as const,
  invite: [...teamsQueryKeys.all, "invite"] as const,
  leave: [...teamsQueryKeys.all, "leave"] as const,
};
