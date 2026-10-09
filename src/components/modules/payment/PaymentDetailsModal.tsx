"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSinglePayment } from "@/hooks/payment.hook";

interface PaymentDetailsModalProps {
  paymentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Payment Type Definition
interface IPayment {
  id: string;
  amount: number;
  status: string;
  paymentGateway?: string;
  merchantInvoiceNumber?: string;
  createdAt: string;
  bkashTrxId?: string;
  sslValId?: string;
  course?: {
    id: string;
    title: string;
    slug?: string;
    coverImageUrl?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export function PaymentDetailsModal({
  paymentId,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  const { data: response, isLoading } = useGetSinglePayment(paymentId || "", {
    enabled: !!paymentId && isOpen,
  });

  const payment = response?.data as IPayment | undefined;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
            Completed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">
            Refunded
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : payment ? (
          <div className="space-y-4 py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              {getStatusBadge(payment.status)}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="font-semibold text-base">৳{payment.amount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gateway</p>
                <p className="font-medium">{payment.paymentGateway || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invoice / Ref</p>
                <p className="font-mono text-xs">
                  {payment.merchantInvoiceNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-xs">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground mb-1">Course</p>
              <p className="font-medium text-foreground">
                {payment.course?.title}
              </p>
            </div>

            {payment.user && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Student</p>
                <p className="font-medium">{payment.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {payment.user.email}
                </p>
              </div>
            )}

            {(payment.bkashTrxId || payment.sslValId) && (
              <>
                <Separator />
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Gateway Specifics
                  </p>
                  {payment.bkashTrxId && (
                    <p className="text-xs">
                      TrxID:{" "}
                      <span className="font-mono">{payment.bkashTrxId}</span>
                    </p>
                  )}
                  {payment.sslValId && (
                    <p className="text-xs">
                      ValID:{" "}
                      <span className="font-mono">{payment.sslValId}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No details found.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
