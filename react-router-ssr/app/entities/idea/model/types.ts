export type IdeaStatus = "draft" | "voting" | "approved" | "in_progress";

export type Idea = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: IdeaStatus;
  avgScore: number | null;
  votesCount: number;
};
