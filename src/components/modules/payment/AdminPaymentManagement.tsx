"use client";

import { useState } from "react";
import { useGetAllPayments } from "@/hooks/payment.hook";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  RotateCcw,
  Eye,
  Search,
} from "lucide-react";

import { RefundDialog } from "./RefundDialog";
import { PaymentDetailsModal } from "./PaymentDetailsModal";

// Static keys for skeleton items to avoid array index key warnings
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function AdminPaymentManagement() {
  const [page, setPage] = useState(1);
  const [studentEmail, setStudentEmail] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  // Dialog states
  const [viewPaymentId, setViewPaymentId] = useState<string | null>(null);
  const [refundPaymentId, setRefundPaymentId] = useState<string | null>(null);

  const queryParams = {
    page: page.toString(),
    limit: "10",
    ...(studentEmail ? { studentEmail } : {}),
    ...(status !== "ALL" ? { status } : {}),
  };

  const { data: response, isLoading } = useGetAllPayments(queryParams);

  const payments = Array.isArray(response?.data) ? response.data : [];
  const meta = response?.meta;

  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Completed</Badge>;
      case "REFUNDED":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Refunded</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Transactions & Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student email..."
              value={studentEmail}
              onChange={(e) => {
                setStudentEmail(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                SKELETON_KEYS.map((skKey) => (
                  <TableRow key={skKey}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
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
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <p className="font-medium">{payment.user?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{payment.user?.email}</p>
                    </TableCell>
                    <TableCell className="max-w-50 truncate">{payment.course?.title}</TableCell>
                    <TableCell className="font-semibold">৳{payment.amount}</TableCell>
                    <TableCell className="uppercase text-xs">{payment.paymentGateway}</TableCell>
                    <TableCell>{renderStatus(payment.status)}</TableCell>
                    <TableCell className="text-xs">{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewPaymentId(payment.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {payment.status === "COMPLETED" && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setRefundPaymentId(payment.id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" /> Refund Payment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-2">
            <span className="text-xs text-muted-foreground">
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total)
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

        {/* Action Modals */}
        <PaymentDetailsModal
          paymentId={viewPaymentId}
          isOpen={!!viewPaymentId}
          onClose={() => setViewPaymentId(null)}
        />

        <RefundDialog
          paymentId={refundPaymentId}
          isOpen={!!refundPaymentId}
          onClose={() => setRefundPaymentId(null)}
        />
      </CardContent>
    </Card>
  );
}