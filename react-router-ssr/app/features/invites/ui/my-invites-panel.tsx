import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} from "~/features/invites/model/mutations/use-invite-response-mutations";
import { useMyInvitesQuery } from "~/features/invites/model/queries/use-my-invites-query";
import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";

const STATUS_LABEL: Record<string, string> = {
  pending_captain: "Ожидает капитана",
  approved: "Можно принять",
};

export function MyInvitesPanel() {
  const query = useMyInvitesQuery();
  const accept = useAcceptInviteMutation();
  const decline = useDeclineInviteMutation();

  if (query.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Мои приглашения</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
          Загрузка…
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Мои приглашения</CardTitle>
          <CardDescription>Не удалось загрузить список.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const rows = query.data ?? [];

  return (
    <Card id="my-invites">
      <CardHeader>
        <CardTitle className="text-base">Мои приглашения</CardTitle>
        <CardDescription>
          Приглашения в команды: ожидание капитана или готовы к принятию.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет активных приглашений.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.inviteId}
                className="flex flex-col gap-2 rounded-md border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium leading-tight">{row.teamName}</p>
                  <p className="text-xs text-muted-foreground">
                    Команда: {row.teamId.slice(0, 8)}…
                  </p>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
                </div>
                {row.status === "approved" ? (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={accept.isPending || decline.isPending}
                      onClick={async () => {
                        try {
                          await accept.mutateAsync(row.inviteId);
                          toast.success("Вы вступили в команду.");
                        } catch (err) {
                          toast.error(await getApiErrorMessage(err));
                        }
                      }}
                    >
                      {accept.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      Принять
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={accept.isPending || decline.isPending}
                      onClick={async () => {
                        try {
                          await decline.mutateAsync(row.inviteId);
                          toast.success("Приглашение отклонено.");
                        } catch (err) {
                          toast.error(await getApiErrorMessage(err));
                        }
                      }}
                    >
                      Отклонить
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
