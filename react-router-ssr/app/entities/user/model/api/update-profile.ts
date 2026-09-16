import type { TeamRole } from "~/entities/team/model/types";
import type { ProfileResponse } from "~/entities/user/model/api/profile";
import { api } from "~/shared/api";

/** Тело PUT /api/profile/me (совпадает с backend ProfileUpdateRequest). */
export interface ProfileUpdateRequest {
  name: string;
  role?: TeamRole;
  skills?: string[];
  lookingForTeam?: boolean;
}

export async function updateProfile(body: ProfileUpdateRequest): Promise<ProfileResponse> {
  const response = await api.put("profile/me", { json: body });
  return response.json<ProfileResponse>();
}
