import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProfile } from "../profile";

/** После успешной загрузки профиля синхронизируем x-user-id с JWT (тот же пользователь, что в токене). */
export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    const id = query.data?.id;
    if (!id || typeof window === "undefined") return;
    try {
      localStorage.setItem("x-user-id", id);
    } catch {
      /* storage недоступен */
    }
  }, [query.data?.id]);

  return query;
};
