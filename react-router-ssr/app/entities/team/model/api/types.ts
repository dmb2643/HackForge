/** Ответы/тела API `/api/teams` и связанных ручек. */

export interface CreateTeamApiRequest {
  name: string;
  description: string;
}

export interface TeamMemberApiResponse {
  id: string;
  name: string;
  role: string | null;
  skills: string[];
}

export interface TeamApiResponse {
  id: string;
  name: string;
  description: string | null;
  captainId: string;
  members: TeamMemberApiResponse[];
  createdAt: string;
}

/** POST /teams/:id/invite */
export interface InviteToTeamApiResponse {
  inviteId: string;
  status: string;
}
