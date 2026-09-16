import type { IdeasSort } from "./api/get-ideas";
import type { IdeaStatus } from "./types";

export const ideasQueryKeys = {
  all: ["ideas"] as const,
  list: (status?: IdeaStatus | "all", sort?: IdeasSort | "default") =>
    [...ideasQueryKeys.all, "list", status ?? "all", sort ?? "createdAt"] as const,
};

export const ideasMutationKeys = {
  create: [...ideasQueryKeys.all, "create"] as const,
  vote: [...ideasQueryKeys.all, "vote"] as const,
  submitForVoting: [...ideasQueryKeys.all, "submit-for-voting"] as const,
};
