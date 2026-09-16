import { Bookmark } from "lucide-react";
import type { ReactNode } from "react";
import type { TeamCardData } from "~/entities/team/model/types";
import { MemberAvatars } from "~/entities/team/ui/member-avatars";
import { RoleBadge } from "~/entities/team/ui/role-badge";
import { TeamAvatar } from "~/entities/team/ui/team-avatar";
import { TechStackIcons } from "~/entities/team/ui/tech-stack-icons";
import { useGetProfile } from "~/entities/user";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";

type TeamCardProps = {
  team: TeamCardData;
  actions: ReactNode;
  onBookmarkToggle?: (teamId: string) => void;
};

function isUserInTeam(teamId: string | null | undefined): boolean {
  return Boolean(teamId?.trim());
}

export function TeamCard({ team, actions, onBookmarkToggle }: TeamCardProps) {
  const { data: profile } = useGetProfile();
  const showActions = !isUserInTeam(profile?.teamId);
  const count = team.members.length;

  return (
    <Card className="h-full gap-0 pb-0">
      <CardHeader className="flex flex-row items-start gap-3 border-b pb-4">
        <TeamAvatar name={team.name} className="shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="truncate text-base leading-tight">{team.name}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground"
              aria-pressed={team.isBookmarked}
              aria-label={team.isBookmarked ? "Remove bookmark" : "Save team"}
              onClick={() => onBookmarkToggle?.(team.id)}
            >
              <Bookmark className={team.isBookmarked ? "fill-primary text-primary" : undefined} />
            </Button>
          </div>
          <CardDescription className="text-xs font-medium text-primary/90">
            {team.track}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{team.description}</p>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Open roles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {team.openRoles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Tech stack
          </p>
          <TechStackIcons stack={team.techStack} />
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40">
        <div className="flex min-w-0 items-center gap-2">
          <MemberAvatars members={team.members} />
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {count}/{team.maxMembers}
          </span>
        </div>
        {showActions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </CardFooter>
    </Card>
  );
}
