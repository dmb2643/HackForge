import { api } from "~/shared/api";

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`tasks/${taskId}`);
}
