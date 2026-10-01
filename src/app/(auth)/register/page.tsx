import React, { Suspense } from "react";
import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[520px] w-full rounded-xl" />}>
      <RegisterForm />
    </Suspense>
  );
}
