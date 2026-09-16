import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileResponse } from "~/entities/user/model/api/profile";
import { type ProfileUpdateRequest, updateProfile } from "~/entities/user/model/api/update-profile";

const profileQueryKey = ["profile"] as const;

type Options = Omit<
  UseMutationOptions<ProfileResponse, Error, ProfileUpdateRequest>,
  "mutationFn" | "mutationKey"
>;

export function useUpdateProfileMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationKey: ["profile", "update"],
    mutationFn: updateProfile,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      queryClient.setQueryData(profileQueryKey, data);
      await userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
