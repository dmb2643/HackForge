export type TeamRole = "frontend" | "backend" | "fullstack" | "designer" | "qa" | "pm";

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TeamCardData {
  id: string;
  name: string;
  /** Из GET /teams — нужен для проверки капитана и т.п. */
  captainId: string;
  track: string;
  description: string;
  openRoles: TeamRole[];
  techStack: string[];
  members: TeamMember[];
  maxMembers: number;
  isBookmarked: boolean;
  /** Optional, used for board filters when present */
  availability?: string;
}
