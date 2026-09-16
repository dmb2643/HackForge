import type { Idea } from "../types";

/** Ответ API совпадает с доменной моделью идеи. */
export type IdeaApiResponse = Idea;

export type CreateIdeaApiRequest = {
  title: string;
  description: string;
};

export type VoteIdeaApiRequest = {
  score: number;
};

export type VoteIdeaApiResponse = {
  ideaId: string;
  avgScore: number | null;
  votesCount: number;
};
