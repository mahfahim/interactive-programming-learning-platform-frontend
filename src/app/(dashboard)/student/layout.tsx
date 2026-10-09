import type { ReactNode } from "react";
import { StudentNavbar } from "@/components/shared/StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/*  */}
      <StudentNavbar />

      {/* main contents */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
