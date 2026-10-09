"use client";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const tranId = searchParams.get("tran_id");
  const paymentID = searchParams.get("paymentID");

  const isSuccess = status === "success";
  const isCancelled = status === "cancelled";

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {isSuccess ? (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your enrollment is complete! You now have full access to all premium
            lessons and course materials.
          </p>
          {(tranId || paymentID) && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800">
              Transaction Ref:{" "}
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {tranId || paymentID}
              </span>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => router.push("/student/courses")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" /> Go to My Enrolled Courses{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : isCancelled ? (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You cancelled the transaction before completing the payment.
          </p>
          <Button
            type="button"
            onClick={() => router.push("/courses")}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 cursor-pointer"
          >
            Browse Courses
          </Button>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Payment Failed
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We couldn't process your transaction. Please try again or use a
            different payment method.
          </p>
          <Button
            type="button"
            onClick={() => router.back()}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </Button>
        </>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center text-slate-500">
            Loading payment details...
          </div>
        }
      >
        <PaymentCallbackContent />
      </Suspense>
    </div>
  );
}
