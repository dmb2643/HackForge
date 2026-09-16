import { Loader2Icon, SparklesIcon } from "lucide-react";
import { RoleBadge } from "~/entities/team";
import { parseParticipantRole } from "~/features/participant-board";
import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/shared/components/ui/card";
import type { RecommendedParticipant } from "../model/types";

function RecommendedCard({
  row,
  inviting,
  onInvite,
}: {
  row: RecommendedParticipant;
  inviting: boolean;
  onInvite: (p: RecommendedParticipant) => void;
}) {
  const role = parseParticipantRole(row.role);
  return (
    <Card className="border-violet-200/60 bg-violet-50/40 dark:border-violet-900/50 dark:bg-violet-950/20">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="min-w-0 space-y-2">
          <CardTitle className="text-base leading-tight">{row.name}</CardTitle>
          <RoleBadge role={role} />
          {row.complementarySkills.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Дополняет команду:{" "}
              <span className="font-medium text-foreground">
                {row.complementarySkills.join(", ")}
              </span>
            </p>
          ) : row.skills.length ? (
            <p className="text-xs text-muted-foreground">
              Навыки уже перекрываются составом — смотрите общий список.
            </p>
          ) : null}
        </div>
        <Button type="button" size="sm" disabled={inviting} onClick={() => onInvite(row)}>
          {inviting ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
          Пригласить
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {row.skills?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {row.skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className={
                  row.complementarySkills.includes(skill)
                    ? "border-violet-400/80 font-normal dark:border-violet-600"
                    : "font-normal"
                }
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Навыки не указаны</p>
        )}
      </CardContent>
    </Card>
  );
}

type Props = {
  rows: RecommendedParticipant[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  invitingId: string | null;
  onInvite: (p: RecommendedParticipant) => void;
};

export function RecommendedForTeamPanel({
  rows,
  isPending,
  isError,
  error,
  onRetry,
  invitingId,
  onInvite,
}: Props) {
  return (
    <section
      className="space-y-3 rounded-xl border border-border bg-card/50 p-4 md:p-5"
      aria-labelledby="rec-team-heading"
    >
      <div className="flex items-center gap-2">
        <SparklesIcon
          className="size-5 shrink-0 text-violet-600 dark:text-violet-400"
          aria-hidden
        />
        <h2 id="rec-team-heading" className="text-base font-semibold tracking-tight">
          Рекомендации для вашей команды
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Участники без команды, отсортированные по навыкам, которых ещё нет в вашем составе. Подходит
        для быстрого дополнения команды до пяти человек.
      </p>
      {isPending ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin" aria-hidden />
          Подбираем кандидатов…
        </div>
      ) : isError ? (
        <div className="flex flex-col gap-2 py-4">
          <p className="text-sm text-destructive">
            {error?.message ?? "Не удалось загрузить рекомендации."}
          </p>
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={onRetry}>
            Повторить
          </Button>
        </div>
      ) : rows?.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <RecommendedCard
              key={row.id}
              row={row}
              inviting={invitingId === row.id}
              onInvite={onInvite}
            />
          ))}
        </div>
      ) : (
        <p className="py-4 text-sm text-muted-foreground">
          Нет кандидатов с подходящим профилем — попробуйте общий список ниже или измените фильтры.
        </p>
      )}
    </section>
  );
}
