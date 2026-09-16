import { api } from "~/shared/api";

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  skills: string[];
  lookingForTeam: boolean;
  /** null если пользователь не в команде */
  teamId: string | null;
  isOrganizer: boolean;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("profile/me");
  return response.json<ProfileResponse>();
};
