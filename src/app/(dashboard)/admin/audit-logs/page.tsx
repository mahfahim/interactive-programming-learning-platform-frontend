// src/app/(dashboard)/admin/audit-logs/page.tsx

"use client";

import { AuditLogsTable } from "@/components/modules/auditLog/AuditLogTable"; // Adjust path to match your component directory

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AuditLogsTable />
    </div>
  );
}
