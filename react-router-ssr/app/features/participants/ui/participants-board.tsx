import { Loader2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { RoleBadge } from "~/entities/team";
import { useTeamDetailQuery } from "~/entities/team/model/queries/use-team-detail";
import { useGetProfile } from "~/entities/user";
import {
  EMPTY_PARTICIPANT_FILTERS,
  filterParticipants,
  type ParticipantBoardFilters,
  ParticipantFilterBar,
  parseParticipantRole,
} from "~/features/participant-board";
import { useParticipantsQuery } from "~/features/participants/model/queries/use-participants-query";
import type { Participant } from "~/features/participants/model/types";
import { useInviteUserToTeamMutation } from "~/features/team-invite/model/mutations/use-invite-user-to-team-mutation";
import {
  RecommendedForTeamPanel,
  type RecommendedParticipant,
  useRecommendedParticipantsQuery,
} from "~/features/team-recommendations";
import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/shared/components/ui/card";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";
import { TeamBoardHeader } from "~/widgets/team-board/ui/team-board-header";

function hasTeamId(teamId: string | null | undefined): boolean {
  return Boolean(teamId?.trim());
}

function ParticipantCard({
  participant,
  currentUserId,
  myTeamId,
  canInvite,
  inviting,
  onInvite,
}: {
  participant: Participant;
  currentUserId: string | undefined;
  myTeamId: string | undefined;
  canInvite: boolean;
  inviting: boolean;
  onInvite: (p: Participant) => void;
}) {
  const canInviteThis =
    canInvite && Boolean(myTeamId) && Boolean(currentUserId) && participant.id !== currentUserId;
  const role = parseParticipantRole(participant.role);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="min-w-0 space-y-2">
          <CardTitle className="text-base leading-tight">{participant.name}</CardTitle>
          <RoleBadge role={role} />
        </div>
        {canInviteThis ? (
          <Button type="button" size="sm" disabled={inviting} onClick={() => onInvite(participant)}>
            {inviting ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
            Пригласить
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        {participant.skills?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {participant.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="font-normal">
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

export function ParticipantsBoard() {
  const { data: profile } = useGetProfile();
  const [filters, setFilters] = useState<ParticipantBoardFilters>(EMPTY_PARTICIPANT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");

  const apiFilters = useMemo(
    () => (filters.role ? { role: filters.role } : undefined),
    [filters.role],
  );

  const {
    data: participants = [],
    isPending,
    isError,
    error,
    refetch,
  } = useParticipantsQuery(apiFilters);

  const visible = useMemo(
    () => filterParticipants(participants, filters, searchQuery),
    [participants, filters, searchQuery],
  );

  const handleSearchQueryChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const inviteMutation = useInviteUserToTeamMutation();
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const myTeamId = profile?.teamId;
  const canInvite = hasTeamId(myTeamId);

  const { data: myTeam } = useTeamDetailQuery(myTeamId ?? undefined);
  const teamMemberCount = myTeam?.members?.length ?? 0;
  const showRecommendations = Boolean(myTeamId?.trim()) && teamMemberCount < 5;

  const {
    data: recommended = [],
    isPending: recPending,
    isError: recError,
    error: recErr,
    refetch: refetchRecommended,
  } = useRecommendedParticipantsQuery(myTeamId ?? undefined, showRecommendations);

  const inviteUserById = async (inviteeUserId: string) => {
    if (!myTeamId) return;
    setInvitingId(inviteeUserId);
    try {
      await inviteMutation.mutateAsync({ teamId: myTeamId, inviteeUserId });
      toast.success("Приглашение отправлено.");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    } finally {
      setInvitingId(null);
    }
  };

  const handleInvite = (participant: Participant) => void inviteUserById(participant.id);
  const handleInviteRecommended = (row: RecommendedParticipant) => void inviteUserById(row.id);

  return (
    <div className="relative flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <TeamBoardHeader
        onSearchQueryChange={handleSearchQueryChange}
        title="Доска «Ищу команду»"
        description="Участники без команды, которые готовы присоединиться. Здесь только те, у кого включён поиск команды."
        searchPlaceholder="Поиск по имени или навыку…"
        searchAriaLabel="Поиск участников по имени или навыку"
      />
      <ParticipantFilterBar filters={filters} onChange={setFilters} />

      {showRecommendations ? (
        <RecommendedForTeamPanel
          rows={recommended}
          isPending={recPending}
          isError={recError}
          error={recError ? (recErr instanceof Error ? recErr : new Error(String(recErr))) : null}
          onRetry={() => void refetchRecommended()}
          invitingId={invitingId}
          onInvite={handleInviteRecommended}
        />
      ) : null}

      {isPending ? (
        <div className="flex flex-1 items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" aria-hidden />
          <span className="text-sm">Загрузка участников…</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Не удалось загрузить список."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Повторить
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {visible.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                currentUserId={profile?.id}
                myTeamId={myTeamId ?? undefined}
                canInvite={canInvite}
                inviting={invitingId === p.id}
                onInvite={handleInvite}
              />
            ))}
          </div>
          {visible.length === 0 && participants.length > 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Никто не подходит под фильтры или поиск. Попробуйте изменить условия.
            </p>
          ) : null}
          {participants.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Пока никого нет — участники появятся здесь, когда отметят, что ищут команду.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
