// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/modules/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { ModuleCreateDialog } from "@/components/modules/module/ModuleCreateDialog";

interface CreateModulePageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
  }>;
}

export default function CreateModulePage({ params }: CreateModulePageProps) {
  const { courseId, superModuleId } = use(params);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`/admin/courses/${courseId}`);
    }
  };

  return (
    <ModuleCreateDialog
      open={true}
      onOpenChange={handleOpenChange}
      superModuleId={superModuleId}
    />
  );
}
