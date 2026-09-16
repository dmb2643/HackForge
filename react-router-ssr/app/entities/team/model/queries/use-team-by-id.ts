import { useMemo } from "react";
import { useTeamsQuery } from "~/entities/team/model/queries/use-teams";

/**
 * Находит команду в кэше списка GET /teams по id (например `profile.teamId`).
 */
export function useTeamById(teamId: string | null | undefined) {
  const teamsQuery = useTeamsQuery();
  const id = teamId?.trim() ?? "";

  const team = useMemo(() => {
    if (!id || !teamsQuery.data) return undefined;
    return teamsQuery.data.find((t) => t.id === id);
  }, [id, teamsQuery.data]);

  const needsLookup = Boolean(id);

  return {
    team,
    name: team?.name ?? null,
    captainId: team?.captainId ?? null,
    /** Пока неизвестно имя: идёт загрузка списка команд при непустом teamId */
    isNameLoading: needsLookup && teamsQuery.isPending,
    isTeamsError: teamsQuery.isError,
  };
}
