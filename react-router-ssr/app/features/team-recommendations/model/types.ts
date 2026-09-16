/** GET /api/teams/:teamId/recommended-participants */
export interface RecommendedParticipant {
  id: string;
  name: string;
  role: string;
  skills: string[];
  lookingForTeam: boolean;
  matchScore: number;
  overlapScore: number;
  complementarySkills: string[];
}
