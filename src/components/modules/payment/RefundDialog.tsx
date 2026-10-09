"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInitiateRefund } from "@/hooks/payment.hook";
import { PaymentValidation } from "@/validation/payment.validation";

interface RefundDialogProps {
  paymentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RefundDialog({
  paymentId,
  isOpen,
  onClose,
}: RefundDialogProps) {
  const { mutate: refund, isPending } = useInitiateRefund({
    onSuccess: () => {
      toast.success("Payment refunded and enrollment canceled successfully.");
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process refund.");
    },
  });

  const form = useForm({
    defaultValues: {
      reason: "",
    },
    onSubmit: async ({ value }) => {
      if (!paymentId) return;
      refund({ paymentId, payload: value });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <RotateCcw className="h-5 w-5" />
            Initiate Payment Refund
          </DialogTitle>
          <DialogDescription>
            This action will attempt to refund the payment via the gateway and
            automatically cancel the student's course enrollment.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="reason"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result =
                  PaymentValidation.initiateRefundValidationSchema.safeParse({
                    reason: value,
                  });
                if (!result.success) {
                  return result.error.issues[0]?.message;
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Reason for Refund (Optional)</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Requested by student, Duplicate purchase, Course issue..."
                  className="resize-none"
                  rows={3}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs font-medium text-destructive">
                    {field.state.meta.errors
                      .map((err) => {
                        if (!err) return "";
                        if (typeof err === "string") return err;
                        const obj = err as Record<string, unknown>;
                        return typeof obj?.message === "string"
                          ? obj.message
                          : String(err);
                      })
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Refund
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
