import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/modules/auth/VerifyEmailForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-95 w-full rounded-xl" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
