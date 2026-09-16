import type { TeamMember } from "~/entities/team/model/types";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "~/shared/components/ui/avatar";

type MemberAvatarsProps = {
  members: TeamMember[];
};

function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export function MemberAvatars({ members }: MemberAvatarsProps) {
  const shown = members.slice(0, 4);

  return (
    <AvatarGroup className="flex items-center">
      {shown.map((m) => (
        <Avatar key={m.id} size="sm" className="ring-2 ring-background">
          {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt="" /> : null}
          <AvatarFallback className="text-[10px]">{memberInitials(m.name)}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
