import type { Participant } from "~/features/participants/model/types";
import { api } from "~/shared/api";

export type GetParticipantsParams = {
  role?: string;
  skill?: string;
};

export async function getParticipants(params?: GetParticipantsParams): Promise<Participant[]> {
  const searchParams = new URLSearchParams();
  if (params?.role) searchParams.set("role", params.role);
  if (params?.skill) searchParams.set("skill", params.skill);
  const q = searchParams.toString();
  const url = q ? `participants?${q}` : "participants";
  const response = await api.get(url);
  return response.json<Participant[]>();
}
