import type { TeamRole } from "~/entities/team/model/types";

export interface CurrentUser {
  id: string;
  name: string;
  /** Short label for sidebar, e.g. "Frontend Dev" */
  roleLabel: string;
  /** Optional DB role for future use */
  role?: TeamRole;
  avatarUrl?: string;
}
