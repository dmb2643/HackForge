import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  type Task,
  type TaskStatus,
  useDeleteTaskMutation,
  usePatchTaskMutation,
  useTasksQuery,
} from "~/entities/task";
import { useTeamDetailQuery } from "~/entities/team/model/queries/use-team-detail";
import { useGetProfile } from "~/entities/user";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/shared/components/ui/card";
import { ScrollArea, ScrollBar } from "~/shared/components/ui/scroll-area";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";
import { cn } from "~/shared/lib/utils";
import { CreateTaskDialog } from "./create-task-dialog";

const WORKFLOW_STATUSES: TaskStatus[] = ["todo", "in_progress", "review", "done"];

function formatDeadline(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("ru-RU");
  } catch {
    return iso;
  }
}

function TaskCard({
  task,
  teamId,
  isCaptain,
  members,
  currentUserId,
}: {
  task: Task;
  teamId: string;
  isCaptain: boolean;
  members: { id: string; name: string }[];
  currentUserId: string | undefined;
}) {
  const patchMutation = usePatchTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const busy = patchMutation.isPending || deleteMutation.isPending;

  const onStatusChange = async (next: TaskStatus) => {
    if (next === task.status) return;
    try {
      await patchMutation.mutateAsync({ teamId, taskId: task.id, body: { status: next } });
      toast.success("Статус обновлён.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const onApprove = async () => {
    try {
      await patchMutation.mutateAsync({ teamId, taskId: task.id, body: { status: "todo" } });
      toast.success("Задача одобрена.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const onAssigneeChange = async (value: string) => {
    try {
      if (!value) {
        await patchMutation.mutateAsync({
          teamId,
          taskId: task.id,
          body: { clearAssignee: true },
        });
      } else {
        await patchMutation.mutateAsync({
          teamId,
          taskId: task.id,
          body: { assigneeId: value },
        });
      }
      toast.success("Исполнитель обновлён.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Удалить задачу?")) return;
    try {
      await deleteMutation.mutateAsync({ teamId, taskId: task.id });
      toast.success("Задача удалена.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const deadlineLabel = formatDeadline(task.deadline);
  const canDelete = task.createdBy === currentUserId || isCaptain;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-sm font-semibold leading-snug">{task.title}</CardTitle>
        {task.description ? (
          <p className="line-clamp-3 text-xs text-muted-foreground">{task.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-xs">
        {deadlineLabel ? <p className="text-muted-foreground">До {deadlineLabel}</p> : null}
        <div className="space-y-1">
          <label className="text-muted-foreground" htmlFor={`assignee-${task.id}`}>
            Исполнитель
          </label>
          <select
            id={`assignee-${task.id}`}
            className={cn(
              "h-9 w-full rounded-md border border-input bg-background px-2 text-xs",
              "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            )}
            disabled={busy}
            value={task.assigneeId ?? ""}
            onChange={(ev) => void onAssigneeChange(ev.target.value)}
          >
            <option value="">Не назначен</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {task.status === "pending_approval" ? (
          <div className="flex flex-col gap-2 pt-1">
            {isCaptain ? (
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={busy}
                onClick={() => void onApprove()}
              >
                Одобрить (в «К выполнению»)
              </Button>
            ) : (
              <p className="text-muted-foreground">Ожидает одобрения капитана</p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-muted-foreground" htmlFor={`status-${task.id}`}>
              Колонка
            </label>
            <select
              id={`status-${task.id}`}
              className={cn(
                "h-9 w-full rounded-md border border-input bg-background px-2 text-xs",
                "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
              disabled={busy}
              value={task.status}
              onChange={(ev) => void onStatusChange(ev.target.value as TaskStatus)}
            >
              {WORKFLOW_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {TASK_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        )}

        {canDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start gap-2 px-2 text-destructive hover:text-destructive"
            disabled={busy}
            onClick={() => void onDelete()}
          >
            <Trash2Icon className="size-3.5" aria-hidden />
            Удалить
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function KanbanPage() {
  const { data: profile, isPending: profilePending } = useGetProfile();
  const teamId = profile?.teamId?.trim() ?? "";
  const { data: team } = useTeamDetailQuery(teamId || undefined);
  const {
    data: tasks = [],
    isPending: tasksPending,
    isError,
    error,
    refetch,
  } = useTasksQuery(teamId || undefined);

  const [createOpen, setCreateOpen] = useState(false);

  const isCaptain = Boolean(profile?.id && team?.captainId && profile.id === team.captainId);

  const members = useMemo(
    () => (team?.members ?? []).map((m) => ({ id: m.id, name: m.name })),
    [team?.members],
  );

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      pending_approval: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    for (const t of tasks) {
      map[t.status].push(t);
    }
    for (const s of TASK_STATUS_ORDER) {
      map[s].sort((a, b) => a.position - b.position);
    }
    return map;
  }, [tasks]);

  if (profilePending) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" aria-hidden />
        <span className="text-sm">Загрузка…</span>
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Канбан команды</h1>
        <p className="text-sm text-muted-foreground">
          Чтобы видеть задачи, вступите в команду на доске участников или откройте свою команду.
        </p>
        <Button asChild variant="default">
          <Link to="/dashboard">К доске «Ищу команду»</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard/teams">Мои команды</Link>
        </Button>
      </div>
    );
  }

  if (tasksPending) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" aria-hidden />
        <span className="text-sm">Загрузка задач…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Ошибка загрузки"}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Канбан</h1>
          <p className="text-sm text-muted-foreground">
            Задачи команды. Новые карточки сначала на согласовании у капитана.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-2 self-start sm:self-auto"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="size-4" aria-hidden />
          Новая задача
        </Button>
      </div>

      <ScrollArea className="w-full pb-2">
        <div className="flex min-w-max gap-3 pb-2">
          {TASK_STATUS_ORDER.map((status) => (
            <div
              key={status}
              className="flex w-[min(100vw-2rem,280px)] shrink-0 flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-2"
            >
              <div className="px-1 py-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {TASK_STATUS_LABELS[status]}
                </p>
                <p className="text-[11px] text-muted-foreground">{byStatus[status].length} задач</p>
              </div>
              <div className="flex max-h-[min(70vh,560px)] flex-col gap-2 overflow-y-auto pr-0.5">
                {byStatus[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    teamId={teamId}
                    isCaptain={isCaptain}
                    members={members}
                    currentUserId={profile?.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <CreateTaskDialog teamId={teamId} open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
