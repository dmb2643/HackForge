import { TeamDetailPage } from "~/widgets/team-detail";

export function meta() {
  return [{ title: "Команда — HackForge" }];
}

export default function TeamDetailRoute() {
  return <TeamDetailPage />;
}
