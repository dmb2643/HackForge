import type { InviteToTeamApiResponse } from "~/entities/team/model/api/types";
import { api } from "~/shared/api";

export type InviteUserToTeamParams = {
  /** Команда, в которую приглашают (текущая команда приглашающего). */
  teamId: string;
  /** Кого приглашают — другой пользователь (inviter ≠ invitee). */
  inviteeUserId: string;
};

/**
 * POST /api/teams/:teamId/invite — приглашающий в X-User-ID, в теле userId приглашённого.
 * Капитан: статус approved; участник: pending_captain.
 */
export async function inviteUserToTeam({
  teamId,
  inviteeUserId,
}: InviteUserToTeamParams): Promise<InviteToTeamApiResponse> {
  const response = await api.post(`teams/${teamId}/invite`, {
    json: { userId: inviteeUserId },
  });
  return response.json<InviteToTeamApiResponse>();
}
