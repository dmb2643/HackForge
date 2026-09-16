import { api } from "~/shared/api";
import type { Task } from "../types";

export type CreateTaskBody = {
  title: string;
  description?: string | null;
  deadline?: string | null;
};

export async function createTask(teamId: string, body: CreateTaskBody): Promise<Task> {
  return api.post(`teams/${teamId}/tasks`, { json: body }).json<Task>();
}
