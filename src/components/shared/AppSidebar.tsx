"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  ScrollText,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppSidebarProps {
  userRole?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export const AppSidebar = ({ userRole = "ADMIN" }: AppSidebarProps) => {
  const pathname = usePathname();

  const navItems =
    userRole === "ADMIN"
      ? [
        { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/courses", label: "Courses", icon: BookOpen },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
        { href: "/admin/payments", label: "Payments", icon: CreditCard },
      ]
      : [
        { href: "/instructor", label: "Overview", icon: LayoutDashboard },
        { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
      ];

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            Dashboard
          </h2>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};