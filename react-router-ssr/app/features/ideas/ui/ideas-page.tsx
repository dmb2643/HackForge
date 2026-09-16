import { Loader2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Idea, IdeaStatus } from "~/entities/idea";
import { useIdeasQuery } from "~/entities/idea";
import { useGetProfile } from "~/entities/user";
import { logSubmitForVotingDebug } from "~/features/ideas/lib/log-submit-for-voting-debug";
import { useApproveIdeaMutation } from "~/features/ideas/model/mutations/use-approve-idea-mutation";
import { useStartIdeaMutation } from "~/features/ideas/model/mutations/use-start-idea-mutation";
import { useSubmitIdeaForVotingMutation } from "~/features/ideas/model/mutations/use-submit-idea-for-voting-mutation";
import { useVoteIdeaMutation } from "~/features/ideas/model/mutations/use-vote-idea-mutation";
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
import { CreateIdeaDialog } from "./create-idea-dialog";

const STATUS_LABEL: Record<IdeaStatus, string> = {
  draft: "Черновик",
  voting: "На голосовании",
  approved: "Одобрена",
  in_progress: "В работе",
};

type ListFilter = "all" | "voting";
type SortFilter = "createdAt" | "avgScore";

function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

function IdeaVoteSection({
  idea,
  currentUserId,
  profileLoading,
  votingForId,
  onVote,
}: {
  idea: Idea;
  currentUserId: string | undefined;
  profileLoading: boolean;
  votingForId: string | null;
  onVote: (ideaId: string, score: number) => void;
}) {
  const isOwn = Boolean(currentUserId && idea.authorId === currentUserId);
  const isVotingOpen = idea.status === "voting";
  const canVote = Boolean(currentUserId) && !isOwn && isVotingOpen && !profileLoading;

  let hint: string | null = null;
  if (!profileLoading) {
    if (!currentUserId) hint = "Войдите в аккаунт, чтобы голосовать.";
    else if (isOwn) hint = "Нельзя голосовать за свою идею.";
    else if (!isVotingOpen) {
      hint =
        idea.status === "draft"
          ? "После того как автор отправит идею на голосование, вы сможете её оценить."
          : "Голосование доступно только в статусе «На голосовании».";
    }
  }

  const busy = votingForId === idea.id;

  return (
    <div className="space-y-2 border-t border-border/80 pt-4">
      <p className="text-xs font-medium text-muted-foreground">Оценка (1–5)</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {busy ? (
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
          Сохранение…
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <Button
              key={score}
              type="button"
              size="sm"
              variant="outline"
              className="min-w-10"
              disabled={!canVote}
              onClick={() => onVote(idea.id, score)}
            >
              {score}
            </Button>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Повторная отправка оценки обновляет ваш голос.
      </p>
    </div>
  );
}

export function IdeasPage() {
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [sortFilter, setSortFilter] = useState<SortFilter>("createdAt");
  const [createOpen, setCreateOpen] = useState(false);
  const [votingForId, setVotingForId] = useState<string | null>(null);
  const [submittingForVotingId, setSubmittingForVotingId] = useState<string | null>(null);
  const [organizerBusyId, setOrganizerBusyId] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const ideasQuery = useIdeasQuery({
    ...(listFilter === "voting" ? { status: "voting" as const } : {}),
    ...(sortFilter === "avgScore" ? { sort: "avgScore" as const } : {}),
  });
  const voteMutation = useVoteIdeaMutation();
  const submitForVotingMutation = useSubmitIdeaForVotingMutation();
  const approveIdeaMutation = useApproveIdeaMutation();
  const startIdeaMutation = useStartIdeaMutation();

  const handleVote = useCallback(
    async (ideaId: string, score: number) => {
      setVotingForId(ideaId);
      try {
        await voteMutation.mutateAsync({ ideaId, request: { score } });
        toast.success("Голос сохранён.");
      } catch (err) {
        toast.error(await getApiErrorMessage(err));
      } finally {
        setVotingForId(null);
      }
    },
    [voteMutation],
  );

  const handleSubmitForVoting = useCallback(
    async (idea: Idea) => {
      logSubmitForVotingDebug(idea, profile?.id);
      setSubmittingForVotingId(idea.id);
      try {
        await submitForVotingMutation.mutateAsync(idea.id);
        toast.success("Идея отправлена на голосование.");
      } catch (err) {
        toast.error(await getApiErrorMessage(err));
      } finally {
        setSubmittingForVotingId(null);
      }
    },
    [submitForVotingMutation, profile?.id],
  );

  const handleOrganizerApprove = useCallback(
    async (ideaId: string) => {
      setOrganizerBusyId(ideaId);
      try {
        await approveIdeaMutation.mutateAsync(ideaId);
        toast.success("Идея одобрена.");
      } catch (err) {
        toast.error(await getApiErrorMessage(err));
      } finally {
        setOrganizerBusyId(null);
      }
    },
    [approveIdeaMutation],
  );

  const handleOrganizerStart = useCallback(
    async (ideaId: string) => {
      setOrganizerBusyId(ideaId);
      try {
        await startIdeaMutation.mutateAsync(ideaId);
        toast.success("Идея переведена в работу.");
      } catch (err) {
        toast.error(await getApiErrorMessage(err));
      } finally {
        setOrganizerBusyId(null);
      }
    },
    [startIdeaMutation],
  );

  const ideasRaw = ideasQuery.data ?? [];
  const ideas = useMemo(() => {
    if (sortFilter !== "avgScore") return ideasRaw;
    return ideasRaw.filter(
      (i) => i.status !== "draft" || (profile?.id != null && i.authorId === profile.id),
    );
  }, [ideasRaw, sortFilter, profile?.id]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Идеи и голосование
              </h1>
              <p className="text-sm text-muted-foreground">
                Публикуйте идеи и голосуйте за предложения в статусе «На голосовании».
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={listFilter === "all" ? "default" : "outline"}
              onClick={() => setListFilter("all")}
            >
              Все
            </Button>
            <Button
              type="button"
              size="sm"
              variant={listFilter === "voting" ? "default" : "outline"}
              onClick={() => setListFilter("voting")}
            >
              На голосовании
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="w-full text-xs font-medium text-muted-foreground">Сортировка</span>
            <Button
              type="button"
              size="sm"
              variant={sortFilter === "createdAt" ? "secondary" : "outline"}
              onClick={() => setSortFilter("createdAt")}
            >
              По дате
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sortFilter === "avgScore" ? "secondary" : "outline"}
              onClick={() => setSortFilter("avgScore")}
            >
              Топ по среднему
            </Button>
          </div>
        </div>
        <Button type="button" className="shrink-0 self-start" onClick={() => setCreateOpen(true)}>
          Предложить идею
        </Button>
      </div>

      {ideasQuery.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" aria-hidden />
          <span>Загрузка идей…</span>
        </div>
      ) : null}

      {ideasQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {ideasQuery.error instanceof Error
            ? ideasQuery.error.message
            : "Не удалось загрузить идеи."}
        </p>
      ) : null}

      {!ideasQuery.isLoading && !ideasQuery.isError && ideas.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Пока нет идей. Станьте первым — предложите свою.
        </p>
      ) : null}

      <ul className="flex flex-col gap-4">
        {ideas.map((idea) => (
          <li key={idea.id}>
            <Card>
              <CardHeader className="space-y-2 pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">{idea.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0 font-normal">
                    {STATUS_LABEL[idea.status]}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {profile?.id === idea.authorId ? (
                    <span className="text-foreground/90">Ваша идея</span>
                  ) : (
                    <>Автор: {shortId(idea.authorId)}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {idea.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>
                    <span className="text-muted-foreground">Средний балл: </span>
                    {idea.avgScore != null ? idea.avgScore.toFixed(1) : "—"}
                  </span>
                  <span>
                    <span className="text-muted-foreground">Голосов: </span>
                    {idea.votesCount}
                  </span>
                </div>
                {profile?.id === idea.authorId && idea.status === "draft" ? (
                  <div className="flex flex-col gap-2 rounded-md border border-border/60 bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">
                      Черновик: отправьте идею на голосование, чтобы другие участники могли её
                      оценить.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="w-fit"
                      disabled={submittingForVotingId === idea.id}
                      onClick={() => void handleSubmitForVoting(idea)}
                    >
                      {submittingForVotingId === idea.id ? (
                        <Loader2Icon className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      Отправить на голосование
                    </Button>
                  </div>
                ) : null}
                <IdeaVoteSection
                  idea={idea}
                  currentUserId={profile?.id}
                  profileLoading={profileLoading}
                  votingForId={votingForId}
                  onVote={handleVote}
                />
                {profile?.isOrganizer && idea.status === "voting" ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/80 pt-4">
                    <p className="w-full text-xs font-medium text-muted-foreground">Организатор</p>
                    <Button
                      type="button"
                      size="sm"
                      disabled={organizerBusyId === idea.id}
                      onClick={() => void handleOrganizerApprove(idea.id)}
                    >
                      {organizerBusyId === idea.id ? (
                        <Loader2Icon className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      Одобрить после голосования
                    </Button>
                  </div>
                ) : null}
                {profile?.isOrganizer && idea.status === "approved" ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/80 pt-4">
                    <p className="w-full text-xs font-medium text-muted-foreground">Организатор</p>
                    <Button
                      type="button"
                      size="sm"
                      disabled={organizerBusyId === idea.id}
                      onClick={() => void handleOrganizerStart(idea.id)}
                    >
                      {organizerBusyId === idea.id ? (
                        <Loader2Icon className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      В работу
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <CreateIdeaDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
