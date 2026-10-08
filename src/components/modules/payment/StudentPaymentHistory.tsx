"use client";

import { useState } from "react";
import { useGetMyPayments } from "@/hooks/payment.hook";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Eye, CreditCard } from "lucide-react";
import { PaymentDetailsModal } from "./PaymentDetailsModal";

// Static keys for skeleton items to satisfy Biome noArrayIndexKey rule
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface IPaymentItem {
  id: string;
  amount: number;
  status: string;
  paymentGateway?: string;
  createdAt: string;
  course?: {
    id: string;
    title: string;
  };
}

export function StudentPaymentHistory() {
  const [page, setPage] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const queryParams = {
    page: page.toString(),
    limit: "10",
  };

  const { data: response, isLoading } = useGetMyPayments(queryParams);

  const payments: IPaymentItem[] = Array.isArray(response?.data) ? response.data : [];
  const meta = response?.meta;

  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Completed</Badge>;
      case "REFUNDED":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                SKELETON_KEYS.map((skKey) => (
                  <TableRow key={skKey}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No payment history found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.course?.title || "N/A"}</TableCell>
                    <TableCell>৳{payment.amount}</TableCell>
                    <TableCell className="uppercase">{payment.paymentGateway || "N/A"}</TableCell>
                    <TableCell>{renderStatus(payment.status)}</TableCell>
                    <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPaymentId(payment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <span className="text-xs text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <PaymentDetailsModal
          paymentId={selectedPaymentId}
          isOpen={!!selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      </CardContent>
    </Card>
  );
}