"use client";

import React, { useState } from "react";
import { useEnrollCourse } from "@/hooks/enrollment.hook";
import { Loader2, ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EnrollmentModalProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  courseId,
  courseTitle,
  price,
  isOpen,
  onClose,
}) => {
  const [paymentGateway, setPaymentGateway] = useState<"BKASH" | "SSLCOMMERZ">("SSLCOMMERZ");
  const isFree = !price || price <= 0;

  const { mutate: enroll, isPending, error } = useEnrollCourse({
    onSuccess: (response) => {
      const data = response.data as {
        isPaidCourse: boolean;
        redirectURL?: string;
        bkashURL?: string;
      };

      if (data.isPaidCourse) {
        const redirectUrl = data.redirectURL || data.bkashURL;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } else {
        onClose();
      }
    },
  });

  const handleEnrollment = () => {
    enroll({
      courseId,
      payload: isFree ? undefined : { paymentGateway },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFree ? "Enroll in Free Course" : "Checkout & Payment"}
          </DialogTitle>
          <DialogDescription>{courseTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Price Summary */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total Price
            </span>
            <span className="text-2xl font-bold text-primary">
              {isFree ? "FREE" : `৳${price.toLocaleString()}`}
            </span>
          </div>

          {/* Payment Selection */}
          {!isFree && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Payment Method
              </span>

              <RadioGroup
                value={paymentGateway}
                onValueChange={(val) => setPaymentGateway(val as "BKASH" | "SSLCOMMERZ")}
                className="space-y-2"
              >
                <Label
                  htmlFor="gateway-sslcommerz"
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                    paymentGateway === "SSLCOMMERZ"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="SSLCOMMERZ" id="gateway-sslcommerz" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">
                        Cards / Net Banking (SSLCommerz)
                      </p>
                      <p className="text-xs font-normal text-muted-foreground">
                        Visa, Mastercard, DBBL, Nagad, etc.
                      </p>
                    </div>
                  </div>
                  {paymentGateway === "SSLCOMMERZ" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </Label>

                <Label
                  htmlFor="gateway-bkash"
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                    paymentGateway === "BKASH"
                      ? "border-pink-600 bg-pink-500/10 dark:bg-pink-950/20"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="BKASH" id="gateway-bkash" />
                    <Badge className="bg-pink-600 font-bold hover:bg-pink-700">
                      bKash
                    </Badge>
                    <div>
                      <p className="text-sm font-semibold">
                        bKash Direct Checkout
                      </p>
                      <p className="text-xs font-normal text-muted-foreground">
                        Fast checkout via bKash gateway
                      </p>
                    </div>
                  </div>
                  {paymentGateway === "BKASH" && (
                    <CheckCircle2 className="h-5 w-5 text-pink-600" />
                  )}
                </Label>
              </RadioGroup>
            </div>
          )}

          {error && (
            <p className="text-xs font-medium text-destructive">
              {error.message || "Failed to process enrollment. Please try again."}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-1/2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleEnrollment}
            disabled={isPending}
            className="w-full sm:w-1/2"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isFree ? "Enroll Now" : "Proceed to Pay"}
          </Button>
        </DialogFooter>

        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>256-Bit Encrypted & Secure Checkout</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};