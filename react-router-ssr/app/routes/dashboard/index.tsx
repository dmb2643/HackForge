import { TeamBoardPage } from "~/pages/team-board-page";

export function meta() {
  return [
    { title: "Find Team Board — HackForge" },
    { name: "description", content: "Найди команду для хакатона" },
  ];
}

export default function DashboardIndex() {
  return <TeamBoardPage />;
}
