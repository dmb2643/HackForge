import type { TeamRole } from "~/entities/team/model/types";

const ROLES: TeamRole[] = ["frontend", "backend", "fullstack", "designer", "qa", "pm"];

export function parseParticipantRole(role: string): TeamRole {
  return ROLES.includes(role as TeamRole) ? (role as TeamRole) : "frontend";
}
