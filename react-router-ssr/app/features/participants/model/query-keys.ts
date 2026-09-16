export const participantsQueryKeys = {
  all: ["participants"] as const,
  list: (filters?: { role?: string; skill?: string }) =>
    [...participantsQueryKeys.all, "list", filters ?? {}] as const,
};
