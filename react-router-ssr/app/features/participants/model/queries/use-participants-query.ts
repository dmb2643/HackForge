import { useQuery } from "@tanstack/react-query";
import { getParticipants } from "~/features/participants/model/api/get-participants";
import { participantsQueryKeys } from "~/features/participants/model/query-keys";

export function useParticipantsQuery(filters?: { role?: string; skill?: string }) {
  return useQuery({
    queryKey: participantsQueryKeys.list(filters),
    queryFn: () => getParticipants(filters),
  });
}
