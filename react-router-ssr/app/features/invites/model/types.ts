/** GET /api/invites/my */
export type MyInviteApiRow = {
  inviteId: string;
  teamId: string;
  teamName: string;
  inviterId: string;
  status: string;
};

/** GET /api/invites/team/:teamId/pending */
export type PendingInviteApiRow = {
  id: string;
  teamId: string;
  inviterId: string;
  inviteeId: string;
  status: string;
  createdAt: string;
};
