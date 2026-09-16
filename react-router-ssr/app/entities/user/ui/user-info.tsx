import { Avatar, AvatarFallback } from "~/shared/components/ui/avatar";
import type { ProfileResponse } from "../model/api/profile";

type UserInfoProps = {
  user: ProfileResponse;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3 overflow-hidden px-2 py-1.5">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">{user.role}</span>
      </div>
    </div>
  );
}
