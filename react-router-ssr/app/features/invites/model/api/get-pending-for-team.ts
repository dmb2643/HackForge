import type { PendingInviteApiRow } from "~/features/invites/model/types";
import { api } from "~/shared/api";

export async function getPendingInvitesForTeam(teamId: string): Promise<PendingInviteApiRow[]> {
  const response = await api.get(`invites/team/${teamId}/pending`);
  return response.json<PendingInviteApiRow[]>();
}
