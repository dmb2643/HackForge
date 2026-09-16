import type { TeamRole } from "~/entities/team/model/types";

/** Фильтры доски «Ищу команду» (роль уходит в GET /api/participants). */
export type ParticipantBoardFilters = {
  role: TeamRole | null;
  skills: string[];
};

export const EMPTY_PARTICIPANT_FILTERS: ParticipantBoardFilters = {
  role: null,
  skills: [],
};
