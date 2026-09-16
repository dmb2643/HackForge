import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type LoginRequest, type LoginResponse, login } from "../api/login";
import { authMutationKeys } from "../query-keys";

type LoginMutationOptions = Omit<
  UseMutationOptions<LoginResponse, Error, LoginRequest>,
  "mutationFn" | "mutationKey"
>;

export function useLoginMutation(options?: LoginMutationOptions) {
  return useMutation({
    mutationKey: authMutationKeys.login,
    mutationFn: login,
    ...options,
  });
}
