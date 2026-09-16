export const invitesQueryKeys = {
  all: ["invites"] as const,
  my: () => [...invitesQueryKeys.all, "my"] as const,
  pendingForTeam: (teamId: string) => [...invitesQueryKeys.all, "pending", teamId] as const,
};
