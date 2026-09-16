import { api } from "~/shared/api";

/** POST /api/teams/:teamId/leave — текущий пользователь в X-User-ID. */
export async function leaveTeam(teamId: string): Promise<void> {
  await api.post(`teams/${teamId}/leave`);
}
