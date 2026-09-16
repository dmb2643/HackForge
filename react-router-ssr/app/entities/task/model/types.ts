export type TaskStatus = "pending_approval" | "todo" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  teamId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  status: TaskStatus;
  deadline: string | null;
  createdBy: string;
  position: number;
  createdAt: string;
}

export const TASK_STATUS_ORDER: TaskStatus[] = [
  "pending_approval",
  "todo",
  "in_progress",
  "review",
  "done",
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending_approval: "На согласовании",
  todo: "К выполнению",
  in_progress: "В работе",
  review: "На проверке",
  done: "Готово",
};
