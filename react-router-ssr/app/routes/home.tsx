import { Navigate } from "react-router";
import { useGetProfile } from "~/entities/user";
import { HomePage } from "~/pages/home-page";
import { MainLoader } from "~/shared/components/main-loader";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data, isLoading } = useGetProfile();
  if (isLoading) {
    return <MainLoader />;
  }

  if (data && data.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return <HomePage />;
}
