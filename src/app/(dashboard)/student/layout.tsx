import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/*  */}
      <Navbar />

      {/* main contents */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
