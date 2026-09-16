import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamCardData } from "~/entities/team/model/types";
import type { TeamBoardFilters } from "~/features/team-filter/model/types";

function matchesQuery(team: TeamCardData, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (team.name.toLowerCase().includes(needle)) return true;
  if (team.description.toLowerCase().includes(needle)) return true;
  if (team.track.toLowerCase().includes(needle)) return true;
  return team.openRoles.some((r) => ROLE_LABELS[r].toLowerCase().includes(needle));
}

function matchesSkillFilters(team: TeamCardData, skills: string[]): boolean {
  if (!skills.length) return true;
  const stacks = team.techStack.map((s) => s.toLowerCase());
  return skills.some((skill) => stacks.some((t) => t.includes(skill.toLowerCase())));
}

export function filterTeams(
  teams: TeamCardData[],
  filters: TeamBoardFilters,
  query: string,
): TeamCardData[] {
  return teams.filter((team) => {
    if (!matchesQuery(team, query)) return false;
    if (!matchesSkillFilters(team, filters.skills)) return false;
    if (filters.role && !team.openRoles.includes(filters.role)) return false;
    if (filters.track && team.track !== filters.track) return false;
    if (filters.availability) {
      if (!team.availability || team.availability !== filters.availability) {
        return false;
      }
    }
    if (filters.teamSize && String(team.maxMembers) !== filters.teamSize) {
      return false;
    }
    return true;
  });
}
