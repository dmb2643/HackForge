import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
  route("auth/recovery-password", "routes/auth/recovery-password.tsx"),
  route("dashboard", "routes/dashboard/layout.tsx", [
    index("routes/dashboard/index.tsx"),
    route("teams", "routes/dashboard/teams.tsx"),
    route("teams/:teamId", "routes/dashboard/teams.$teamId.tsx"),
    route("ideas", "routes/dashboard/ideas.tsx"),
    route("kanban", "routes/dashboard/kanban.tsx"),
    route("leaderboard", "routes/dashboard/leaderboard.tsx"),
    route("profile", "routes/dashboard/profile.tsx"),
  ]),
] satisfies RouteConfig;
