// src/app/(dashboard)/student/payments/page.tsx

import type { Metadata } from "next";
import { StudentPaymentHistory } from "@/components/modules/payment/StudentPaymentHistory";

export const metadata: Metadata = {
  title: "Payment History | Student Dashboard",
  description: "View your course transaction details and payment status.",
};

export default function StudentPaymentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          View your complete payment history and invoice receipts.
        </p>
      </div>

      <StudentPaymentHistory />
    </div>
  );
}
