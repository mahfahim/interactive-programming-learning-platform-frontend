import React, { Suspense } from "react";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-xl" />}>
      <LoginForm />
    </Suspense>
  );
}
