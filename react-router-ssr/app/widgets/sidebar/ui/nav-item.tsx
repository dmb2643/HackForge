import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Badge } from "~/shared/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "~/shared/components/ui/sidebar";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Счётчик рядом с пунктом (например, ожидающие действия приглашения). */
  badgeCount?: number;
};

export function NavItem({ href, label, icon: Icon, badgeCount }: NavItemProps) {
  const { pathname } = useLocation();
  const pathOnly = href.split("#")[0] ?? href;
  const isActive = pathname === pathOnly;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link to={href} className="mt-0.5 flex items-center gap-2">
          <Icon />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badgeCount != null && badgeCount > 0 ? (
            <Badge className="ml-auto h-5 min-w-5 shrink-0 justify-center px-1.5 text-[10px] tabular-nums">
              {badgeCount > 99 ? "99+" : badgeCount}
            </Badge>
          ) : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
