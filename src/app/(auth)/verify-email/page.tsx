import React, { Suspense } from "react";
import { VerifyEmailForm } from "@/components/modules/auth/VerifyEmailForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[380px] w-full rounded-xl" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
