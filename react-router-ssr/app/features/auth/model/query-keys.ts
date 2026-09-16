/** Ключи мутаций auth для React Query (devtools, инвалидация). */
export const authMutationKeys = {
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
};
