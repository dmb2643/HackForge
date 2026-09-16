import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLeaveTeamMutation } from "~/entities/team";
import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamRole } from "~/entities/team/model/types";
import type { ProfileResponse } from "~/entities/user/model/api/profile";
import { useUpdateProfileMutation } from "~/entities/user/model/mutations/use-update-profile-mutation";
import { SkillsList } from "~/features/skills-list";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { Skeleton } from "~/shared/components/ui/skeleton";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";
import { cn } from "~/shared/lib/utils";

const ROLES: TeamRole[] = ["frontend", "backend", "fullstack", "designer", "qa", "pm"];

function parseRole(role: string): TeamRole {
  return ROLES.includes(role as TeamRole) ? (role as TeamRole) : "frontend";
}

export type ProfileEditFormProps = {
  profile: ProfileResponse;
  /** Название из GET /teams по `profile.teamId` */
  teamName?: string | null;
  /** Капитан команды из GET /teams (если команда есть в списке) */
  teamCaptainId?: string | null;
  /** Пока грузится список команд (при непустом teamId) */
  isTeamNameLoading?: boolean;
};

export function ProfileEditForm({
  profile,
  teamName = null,
  teamCaptainId = null,
  isTeamNameLoading = false,
}: ProfileEditFormProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState<TeamRole>(() => parseRole(profile.role));
  const [skills, setSkills] = useState<string[]>(() => [...profile.skills]);

  useEffect(() => {
    setName(profile.name);
    setRole(parseRole(profile.role));
    setSkills([...profile.skills]);
  }, [profile]);

  const mutation = useUpdateProfileMutation();
  const leaveTeamMutation = useLeaveTeamMutation();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const teamIdTrimmed = profile.teamId?.trim() ?? "";
  const captainIdTrimmed = teamCaptainId?.trim() ?? "";
  const isCaptain = Boolean(captainIdTrimmed) && captainIdTrimmed === profile.id.trim();
  const canLeaveTeam = Boolean(teamIdTrimmed) && !isTeamNameLoading && !isCaptain;
  const isBusy = mutation.isPending || leaveTeamMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Укажите имя");
      return;
    }
    try {
      await mutation.mutateAsync({
        name: trimmed,
        role,
        skills,
      });
      toast.success("Профиль сохранён");
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const handleLeaveTeam = async () => {
    if (!teamIdTrimmed) return;
    try {
      await leaveTeamMutation.mutateAsync(teamIdTrimmed);
      toast.success("Вы вышли из команды");
      setLeaveDialogOpen(false);
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  const trimmedName = name.trim();
  const dirty =
    trimmedName !== profile.name.trim() ||
    role !== parseRole(profile.role) ||
    JSON.stringify(skills) !== JSON.stringify(profile.skills);

  return (
    <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)}>
      <div className="grid gap-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={profile.email} disabled readOnly className="bg-muted/60" />
        <p className="text-xs text-muted-foreground">Email меняется только через поддержку.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profile-name">Имя</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isBusy}
          autoComplete="name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profile-role">Роль</Label>
        <select
          id="profile-role"
          className={cn(
            "flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          )}
          value={role}
          onChange={(e) => setRole(e.target.value as TeamRole)}
          disabled={isBusy}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label>Статус команды</Label>
        {teamIdTrimmed ? (
          <>
            <div className="text-sm text-foreground">
              {isTeamNameLoading ? (
                <Skeleton className="h-5 w-56 max-w-full" />
              ) : teamName ? (
                <p>
                  Вы в команде: <span className="font-medium">{teamName}</span>
                </p>
              ) : (
                <p>Вы в команде</p>
              )}
            </div>
            {!isTeamNameLoading && !teamName ? (
              <p className="text-xs text-muted-foreground break-all font-mono">
                Команда не найдена в каталоге (id: {teamIdTrimmed})
              </p>
            ) : null}
            {isCaptain ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Капитан не может выйти из команды.
              </p>
            ) : null}
            {canLeaveTeam ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-fit"
                  disabled={isBusy}
                  onClick={() => setLeaveDialogOpen(true)}
                >
                  Выйти из команды
                </Button>
                <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                  <DialogContent showCloseButton={!leaveTeamMutation.isPending}>
                    <DialogHeader>
                      <DialogTitle>Выйти из команды?</DialogTitle>
                      <DialogDescription>
                        Вы покинете состав. Если вы были последним участником, команда будет
                        удалена.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={leaveTeamMutation.isPending}
                        onClick={() => setLeaveDialogOpen(false)}
                      >
                        Отмена
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={leaveTeamMutation.isPending}
                        onClick={() => void handleLeaveTeam()}
                      >
                        {leaveTeamMutation.isPending ? (
                          <Loader2Icon className="size-4 animate-spin" data-icon="inline-start" />
                        ) : null}
                        Выйти
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-foreground">Не состоите в команде</p>
        )}
        <p className="text-xs text-muted-foreground">
          Меняется только при вступлении в команду или выходе из неё.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Навыки</Label>
        <SkillsList skills={skills} onChange={setSkills} disabled={isBusy} idPrefix="profile" />
      </div>

      <Button type="submit" disabled={isBusy || !dirty}>
        {mutation.isPending ? (
          <Loader2Icon className="size-4 animate-spin" data-icon="inline-start" />
        ) : null}
        Сохранить
      </Button>
    </form>
  );
}
