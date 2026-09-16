import { CreateTeamButton } from "~/features/create-team/ui/create-team-button";
import { TeamSearchInput } from "~/features/team-search/ui/team-search-input";
import { SidebarTrigger } from "~/shared/components/ui/sidebar";
import { ParticipantInvitePopover } from "~/widgets/team-board/ui/participant-invite-popover";

type TeamBoardHeaderProps = {
  onSearchQueryChange: (query: string) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
};

export function TeamBoardHeader({
  onSearchQueryChange,
  title = "Find Team Board",
  description = "Discover and join teams matching your skills and interests.",
  searchPlaceholder = "Search teams, roles...",
  searchAriaLabel = "Search",
}: TeamBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end w-full flex-col gap-3 lg:max-w-md">
        <TeamSearchInput
          onQueryChange={onSearchQueryChange}
          className="w-full sm:max-w-sm"
          placeholder={searchPlaceholder}
          ariaLabel={searchAriaLabel}
        />
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <ParticipantInvitePopover />
          <CreateTeamButton />
        </div>
      </div>
    </div>
  );
}
