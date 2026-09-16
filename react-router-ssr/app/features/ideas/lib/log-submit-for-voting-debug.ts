import type { Idea } from "~/entities/idea";

/** Отладка 403: смотреть в DevTools → Console при нажатии «Отправить на голосование». Только в dev. */
export function logSubmitForVotingDebug(idea: Idea, profileId: string | undefined): void {
  if (!import.meta.env.DEV) return;

  let storageUserId: string | null = null;
  try {
    storageUserId = localStorage.getItem("x-user-id");
  } catch {
    storageUserId = "(localStorage недоступен)";
  }

  let hasToken = false;
  try {
    hasToken = Boolean(localStorage.getItem("token"));
  } catch {
    /* ignore */
  }

  console.info("[ideas/submit-for-voting] клиент (сверьте с логом IdeaService на бэкенде)", {
    ideaId: idea.id,
    ideaStatus: idea.status,
    authorId: idea.authorId,
    profileId: profileId ?? "(профиль ещё не загружен)",
    localStorageXUserId: storageUserId,
    hasToken,
    uiOwnIdeaFlag: profileId === idea.authorId,
  });
}
