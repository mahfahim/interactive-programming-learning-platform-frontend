import type { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          {/* Sidebar Primitive */}
          <AppSidebar userRole="ADMIN" />

          {/* Main Workspace Area */}
          <SidebarInset className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {/* Top Header */}
            <DashboardHeader userRole="ADMIN" />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}