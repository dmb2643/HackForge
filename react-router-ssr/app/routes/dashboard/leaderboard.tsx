import { DashboardPlaceholderPage } from "~/shared/components/dashboard-placeholder-page";

export function meta() {
  return [{ title: "Leaderboard — HackForge" }];
}

export default function Leaderboard() {
  return (
    <DashboardPlaceholderPage
      title="Leaderboard"
      description="See team scores and hackathon progress."
    />
  );
}
