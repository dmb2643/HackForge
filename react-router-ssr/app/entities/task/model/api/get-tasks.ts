import { api } from "~/shared/api";
import type { Task } from "../types";

export async function getTasks(teamId: string): Promise<Task[]> {
  return api.get(`teams/${teamId}/tasks`).json<Task[]>();
}
