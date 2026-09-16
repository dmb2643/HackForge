import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/get-tasks";
import { tasksQueryKeys } from "../query-keys";

export function useTasksQuery(teamId: string | undefined) {
  const id = teamId?.trim() ?? "";
  return useQuery({
    queryKey: tasksQueryKeys.byTeam(id),
    queryFn: () => getTasks(id),
    enabled: Boolean(id),
  });
}
