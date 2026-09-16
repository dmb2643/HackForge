import type { MyInviteApiRow } from "~/features/invites/model/types";
import { api } from "~/shared/api";

export async function getMyInvites(): Promise<MyInviteApiRow[]> {
  const response = await api.get("invites/my");
  return response.json<MyInviteApiRow[]>();
}
