import { api } from "~/shared/api";

export async function postAcceptInvite(inviteId: string): Promise<void> {
  await api.post(`invites/${inviteId}/accept`);
}

export async function postDeclineInvite(inviteId: string): Promise<void> {
  await api.post(`invites/${inviteId}/decline`);
}

export async function postCaptainApproveInvite(inviteId: string): Promise<void> {
  await api.post(`invites/${inviteId}/approve`);
}

export async function postCaptainRejectInvite(inviteId: string): Promise<void> {
  await api.post(`invites/${inviteId}/reject`);
}
