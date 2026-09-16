import { ArrowLeft, Loader2Icon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useLeaveTeamMutation, useTeamDetailQuery } from "~/entities/team";
import { useGetProfile } from "~/entities/user";
import { CaptainPendingInvites } from "~/features/invites";
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
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";

export function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { data: profile } = useGetProfile();
  const query = useTeamDetailQuery(teamId);
  const leaveMutation = useLeaveTeamMutation();

  const team = query.data;
  const memberCount = team?.members.length ?? 0;
  const needsMoreMembers = memberCount < 2;
  const isInThisTeam = profile?.teamId === team?.id;
  const isCaptain = Boolean(team && profile?.id === team.captainId);

  const handleLeave = async () => {
    if (!team?.id) return;
    try {
      await leaveMutation.mutateAsync(team.id);
      toast.success("Вы вышли из команды.");
      void navigate("/dashboard/teams");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  if (query.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 px-4 py-16 text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" aria-hidden />
        Загрузка команды…
      </div>
    );
  }

  if (query.isError || !team) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Button type="button" variant="ghost" size="sm" className="w-fit" asChild>
          <Link to="/dashboard/teams">
            <ArrowLeft className="mr-2 size-4" aria-hidden />К списку команд
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Команда не найдена</CardTitle>
            <CardDescription>
              {query.error instanceof Error ? query.error.message : "Проверьте ссылку."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/80 pb-6">
        <SidebarTrigger className="md:hidden" />
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link to="/dashboard/teams">
            <ArrowLeft className="mr-2 size-4" aria-hidden />
            Назад
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{team.name}</h1>
          <p className="text-sm text-muted-foreground">
            Капитан: {team.captainId.slice(0, 8)}… · участников: {memberCount}
          </p>
        </div>
        {needsMoreMembers ? (
          <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
            В команде меньше 2 человек — пригласите участника
          </Badge>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Описание</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {team.description?.trim() || "Нет описания."}
          </p>
        </CardContent>
      </Card>

      {isCaptain ? <CaptainPendingInvites teamId={team.id} /> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Состав</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border/80 rounded-md border border-border/60">
            {team.members.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-muted-foreground">
                  {m.role ?? "—"} · {m.id.slice(0, 8)}…
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {isInThisTeam ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="destructive"
            disabled={leaveMutation.isPending}
            onClick={() => void handleLeave()}
          >
            {leaveMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" aria-hidden />
            ) : null}
            Покинуть команду
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Вы не в этой команде. Чтобы присоединиться, дождитесь приглашения на доске участников или
          примите его в разделе «Мои приглашения».
        </p>
      )}
    </div>
  );
}
