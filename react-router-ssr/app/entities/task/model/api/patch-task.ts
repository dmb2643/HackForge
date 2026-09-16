import { api } from "~/shared/api";
import type { Task, TaskStatus } from "../types";

export type PatchTaskBody = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null;
  clearAssignee?: boolean;
  deadline?: string | null;
  clearDeadline?: boolean;
  position?: number;
};

export async function patchTask(taskId: string, body: PatchTaskBody): Promise<Task> {
  return api.patch(`tasks/${taskId}`, { json: body }).json<Task>();
}
