import type { ParticipantBoardFilters } from "~/features/participant-board/model/types";
import type { Participant } from "~/features/participants/model/types";

function matchesQuery(p: Participant, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  if (p.name.toLowerCase().includes(needle)) return true;
  return p.skills.some((s) => s.toLowerCase().includes(needle));
}

/** У участника есть хотя бы один из выбранных навыков (точное совпадение, без учёта регистра). */
function matchesSkillFilters(p: Participant, selectedSkills: string[]): boolean {
  if (selectedSkills.length === 0) return true;
  const lower = p.skills.map((s) => s.toLowerCase());
  return selectedSkills.some((sel) => lower.includes(sel.toLowerCase()));
}

export function filterParticipants(
  participants: Participant[],
  filters: ParticipantBoardFilters,
  searchQuery: string,
): Participant[] {
  return participants.filter(
    (p) => matchesQuery(p, searchQuery) && matchesSkillFilters(p, filters.skills),
  );
}
