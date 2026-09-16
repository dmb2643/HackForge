"use client";

import { Bell, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetProfile } from "~/entities/user";
import { useInviteUserToTeamMutation } from "~/features/team-invite/model/mutations/use-invite-user-to-team-mutation";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "~/shared/components/ui/popover";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";

/** UUID (любая версия, формат 8-4-4-4-12). */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ParticipantInvitePopoverProps = {
  className?: string;
};

export function ParticipantInvitePopover({ className }: ParticipantInvitePopoverProps) {
  const { data: profile, isPending: profileLoading } = useGetProfile();
  const inviteMutation = useInviteUserToTeamMutation();
  const [open, setOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");

  const teamId = profile?.teamId?.trim();
  const canInvite = Boolean(teamId);

  const handleInvite = async () => {
    const tid = teamId;
    if (!tid) return;
    const id = userIdInput.trim();
    if (!UUID_REGEX.test(id)) {
      toast.error("Укажите корректный UUID пользователя.");
      return;
    }
    if (id === profile?.id) {
      toast.error("Нельзя пригласить самого себя.");
      return;
    }
    try {
      await inviteMutation.mutateAsync({ teamId: tid, inviteeUserId: id });
      toast.success("Приглашение отправлено.");
      setUserIdInput("");
      setOpen(false);
    } catch (err) {
      toast.error(await getApiErrorMessage(err));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Пригласить участника в команду"
          className={className}
        >
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-[22rem]">
        <PopoverHeader>
          <PopoverTitle>Пригласить участника</PopoverTitle>
          <PopoverDescription>
            {canInvite
              ? "Введите UUID пользователя — тот же идентификатор, что в карточке участника или в профиле."
              : "Чтобы отправлять приглашения, у вас должна быть команда."}
          </PopoverDescription>
        </PopoverHeader>
        {profileLoading ? (
          <p className="text-xs text-muted-foreground">Загрузка профиля…</p>
        ) : canInvite ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void handleInvite();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="invite-user-id">ID пользователя</Label>
              <Input
                id="invite-user-id"
                name="invite-user-id"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={inviteMutation.isPending || !userIdInput.trim()}
            >
              {inviteMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Отправить приглашение
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            Создайте команду кнопкой «Создать команду» рядом или вступите в команду на странице
            команд.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
