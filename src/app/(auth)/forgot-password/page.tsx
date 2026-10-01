import React, { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/modules/auth/ForgotPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[320px] w-full rounded-xl" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
