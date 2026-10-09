import type { ReactNode } from "react";
import { Footer } from "@/components/shared/Footer";
import { HomeNavbar } from "@/components/shared/HomeNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <HomeNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
