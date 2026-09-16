import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type RegisterRequest, type RegisterResponse, register } from "../api/register";
import { authMutationKeys } from "../query-keys";

type RegisterMutationOptions = Omit<
  UseMutationOptions<RegisterResponse, Error, RegisterRequest>,
  "mutationFn" | "mutationKey"
>;

export function useRegisterMutation(options?: RegisterMutationOptions) {
  return useMutation({
    mutationKey: authMutationKeys.register,
    mutationFn: register,
    ...options,
  });
}
