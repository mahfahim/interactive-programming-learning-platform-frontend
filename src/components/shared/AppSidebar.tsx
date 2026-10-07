"use client";

import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          { href: "/admin/audit-logs", label: "Audit Logs", icon: Settings },
        ]
      : [
          { href: "/instructor", label: "Overview", icon: LayoutDashboard },
          { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
          {
            href: "/instructor/students",
            label: "Students",
            icon: GraduationCap,
          },
          { href: "/instructor/settings", label: "Settings", icon: Settings }, 
        ];

  return (
    <aside className="w-64 border-r bg-card h-screen p-4 flex flex-col justify-between">
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight px-3">Dashboard</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
