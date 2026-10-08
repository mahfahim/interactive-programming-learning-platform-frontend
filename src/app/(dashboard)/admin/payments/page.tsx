// src/app/(dashboard)/admin/payments/page.tsx
import { Metadata } from "next";
import { AdminPaymentManagement } from "@/components/modules/payment/AdminPaymentManagement";

export const metadata: Metadata = {
  title: "Payment Management | Admin Dashboard",
  description: "Manage student transactions, search payment records, and execute gateway refunds.",
};

export default function AdminPaymentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all student transactions, filter payment statuses, and process refunds.
        </p>
      </div>

      <AdminPaymentManagement />
    </div>
  );
}
