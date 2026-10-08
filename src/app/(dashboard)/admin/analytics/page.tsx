// src/app/(dashboard)/admin/analytics/page.tsx
import type { Metadata } from "next";
import AdminOverviewDashboard from "@/components/modules/analytics/AdminOverviewDashboard";

export const metadata: Metadata = {
  title: "Analytics Overview | Admin Dashboard",
  description:
    "Real-time performance indicators, financial insights, and user engagement metrics.",
};

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto py-6">
      <AdminOverviewDashboard />
    </main>
  );
}
