import type { TeamRole } from "~/entities/team/model/types";

export type {
  CreateTeamApiRequest,
  TeamApiResponse,
  TeamMemberApiResponse,
} from "~/entities/team/model/api/types";

/** Поля формы; track и openRoles пока не отправляются в API, только в UI после создания. */
export interface CreateTeamFormValues {
  name: string;
  description: string;
  track: string;
  openRoles: TeamRole[];
}
