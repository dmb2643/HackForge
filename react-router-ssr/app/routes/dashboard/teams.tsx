import { TeamsDashboardPage } from "~/widgets/teams-dashboard/ui/teams-dashboard-page";

export function meta() {
  return [{ title: "Команды — HackForge" }];
}

export default function Teams() {
  return <TeamsDashboardPage />;
}
