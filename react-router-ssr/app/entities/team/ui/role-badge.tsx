import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamRole } from "~/entities/team/model/types";
import { Badge } from "~/shared/components/ui/badge";

type RoleBadgeProps = {
  role: TeamRole;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1.5 font-normal">
      <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      {ROLE_LABELS[role]}
    </Badge>
  );
}
