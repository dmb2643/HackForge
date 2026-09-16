import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  useCaptainApproveInviteMutation,
  useCaptainRejectInviteMutation,
} from "~/features/invites/model/mutations/use-invite-response-mutations";
import { usePendingInvitesForTeamQuery } from "~/features/invites/model/queries/use-pending-invites-for-team-query";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";

type CaptainPendingInvitesProps = {
  teamId: string;
};

function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

export function CaptainPendingInvites({ teamId }: CaptainPendingInvitesProps) {
  const query = usePendingInvitesForTeamQuery(teamId);
  const approve = useCaptainApproveInviteMutation();
  const reject = useCaptainRejectInviteMutation();

  if (query.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ожидают вашего решения</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
          Загрузка…
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return null;
  }

  const rows = query.data ?? [];
  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ожидают вашего решения</CardTitle>
        <CardDescription>
          Участники пригласили кандидатов — подтвердите или отклоните заявку.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-3">
          {rows.map((inv) => (
            <li
              key={inv.id}
              className="flex flex-col gap-2 rounded-md border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 text-sm">
                <p>
                  <span className="text-muted-foreground">Приглашённый: </span>
                  {shortId(inv.inviteeId)}
                </p>
                <p className="text-xs text-muted-foreground">От: {shortId(inv.inviterId)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={approve.isPending || reject.isPending}
                  onClick={async () => {
                    try {
                      await approve.mutateAsync(inv.id);
                      toast.success("Приглашение одобрено.");
                    } catch (err) {
                      toast.error(await getApiErrorMessage(err));
                    }
                  }}
                >
                  {approve.isPending ? (
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  Одобрить
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={approve.isPending || reject.isPending}
                  onClick={async () => {
                    try {
                      await reject.mutateAsync(inv.id);
                      toast.success("Отклонено.");
                    } catch (err) {
                      toast.error(await getApiErrorMessage(err));
                    }
                  }}
                >
                  Отклонить
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
