import type { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AppSidebar userRole="ADMIN" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <DashboardHeader userRole="ADMIN" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
