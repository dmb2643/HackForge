import { api } from "~/shared/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("auth/login", { json: request });
  return response.json<LoginResponse>();
};
