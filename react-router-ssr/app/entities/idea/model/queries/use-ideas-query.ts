import { useQuery } from "@tanstack/react-query";
import { type GetIdeasParams, getIdeas } from "../api/get-ideas";
import { ideasQueryKeys } from "../query-keys";

export function useIdeasQuery(params?: GetIdeasParams) {
  const statusKey = params?.status ?? "all";
  const sortKey = params?.sort ?? "createdAt";
  return useQuery({
    queryKey: ideasQueryKeys.list(statusKey, sortKey),
    queryFn: () => getIdeas(params),
  });
}
