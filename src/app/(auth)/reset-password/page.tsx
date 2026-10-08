import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/modules/auth/ResetPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-120 w-full rounded-xl" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
