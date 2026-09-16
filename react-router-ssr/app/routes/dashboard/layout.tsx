import { Outlet } from "react-router";
import { DashboardLayout } from "~/layouts/dashboard-layout";

export default function Layout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
