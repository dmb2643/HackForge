import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useGetProfile } from "~/entities/user";
import { MainLoader } from "~/shared/components/main-loader";
import { SidebarInset, SidebarProvider } from "~/shared/components/ui/sidebar";
import { AppSidebar } from "~/widgets/sidebar/ui/app-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data, isLoading } = useGetProfile();

  if (isLoading) {
    return <MainLoader />;
  }

  if (!data) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={data} />
      <SidebarInset className="min-h-svh overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
