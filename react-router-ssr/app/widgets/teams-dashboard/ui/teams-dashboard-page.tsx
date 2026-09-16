import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Link } from "react-router";
import { mapTeamApiToTeamCardData } from "~/entities/team/lib/map-team-api-to-card";
import { getTeams } from "~/entities/team/model/api/get-teams";
import { teamsQueryKeys } from "~/entities/team/model/query-keys";
import { MyInvitesPanel } from "~/features/invites";
import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { SidebarTrigger } from "~/shared/components/ui/sidebar";

export function TeamsDashboardPage() {
  const teamsQuery = useQuery({
    queryKey: teamsQueryKeys.list(),
    queryFn: async () => {
      const list = await getTeams();
      return list.map(mapTeamApiToTeamCardData);
    },
  });

  const teams = teamsQuery.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-col gap-2 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Команды</h1>
            <p className="text-sm text-muted-foreground">
              Список команд хакатона. Откройте карточку, чтобы увидеть состав и действия.
            </p>
          </div>
        </div>
      </div>

      <MyInvitesPanel />

      {teamsQuery.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" aria-hidden />
          <span>Загрузка команд…</span>
        </div>
      ) : null}

      {teamsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {teamsQuery.error instanceof Error
            ? teamsQuery.error.message
            : "Не удалось загрузить команды."}
        </p>
      ) : null}

      {!teamsQuery.isLoading && !teamsQuery.isError && teams.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет ни одной команды.</p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const n = team.members.length;
          const needsMore = n < 2;
          return (
            <li key={team.id}>
              <Card className="h-full">
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{team.name}</CardTitle>
                    {needsMore ? (
                      <Badge
                        variant="outline"
                        className="shrink-0 text-amber-700 dark:text-amber-400"
                      >
                        Нужен ещё участник
                      </Badge>
                    ) : null}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {team.description || "Без описания"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Участников: {n} / {team.maxMembers}
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="w-fit" asChild>
                    <Link to={`/dashboard/teams/${team.id}`}>Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
