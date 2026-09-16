import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsQueryKeys } from "~/entities/team/model/query-keys";
import {
  postAcceptInvite,
  postCaptainApproveInvite,
  postCaptainRejectInvite,
  postDeclineInvite,
} from "~/features/invites/model/api/post-invite-actions";
import { invitesQueryKeys } from "~/features/invites/model/query-keys";

const profileQueryKey = ["profile"] as const;
const participantsQueryKey = ["participants"] as const;

export function useAcceptInviteMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAcceptInvite,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: invitesQueryKeys.my() });
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      await queryClient.invalidateQueries({ queryKey: participantsQueryKey });
      await options?.onSuccess?.(...args);
    },
  });
}

export function useDeclineInviteMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeclineInvite,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: invitesQueryKeys.my() });
      await options?.onSuccess?.(...args);
    },
  });
}

export function useCaptainApproveInviteMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCaptainApproveInvite,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: invitesQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: teamsQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
  });
}

export function useCaptainRejectInviteMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCaptainRejectInvite,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: invitesQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
  });
}
