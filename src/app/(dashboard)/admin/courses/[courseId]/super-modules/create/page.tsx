// src/app/(dashboard)/admin/courses/[courseId]/super-modules/create/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { SuperModuleCreateDialog } from "@/components/modules/superModule/SuperModuleCreateDialog";

interface CreateSuperModulePageProps {
  params: Promise<{ courseId: string }>;
}

export default function CreateSuperModulePage({
  params,
}: CreateSuperModulePageProps) {
  const { courseId } = use(params);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`/admin/courses/${courseId}`);
    }
  };

  const handleSuccess = () => {
    router.push(`/admin/courses/${courseId}`);
    router.refresh();
  };

  return (
    <SuperModuleCreateDialog
      open={true}
      onOpenChange={handleOpenChange}
      courseId={courseId}
      onSuccess={handleSuccess}
    />
  );
}
