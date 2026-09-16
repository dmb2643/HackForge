import type { TeamRole } from "~/entities/team/model/types";

export type TeamBoardFilters = {
  skills: string[];
  role: TeamRole | null;
  track: string | null;
  availability: string | null;
  teamSize: string | null;
};

export const EMPTY_FILTERS: TeamBoardFilters = {
  skills: [],
  role: null,
  track: null,
  availability: null,
  teamSize: null,
};

export const SKILL_OPTIONS = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "PostgreSQL",
  "AWS",
] as const;

export const TRACK_OPTIONS = [
  "AI & Machine Learning",
  "Web3 & FinTech",
  "Open Innovation",
] as const;

export const AVAILABILITY_OPTIONS = ["Full-time", "Part-time", "Weekends only"] as const;

export const TEAM_SIZE_OPTIONS = ["2", "3", "4", "5"] as const;
