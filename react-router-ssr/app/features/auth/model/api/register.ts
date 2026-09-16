import { api } from "~/shared/api";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const register = async (request: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post("auth/register", { json: request });
  return response.json<RegisterResponse>();
};
