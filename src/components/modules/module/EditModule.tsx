"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModuleById } from "@/hooks/module.hook";
import type { IModule } from "@/types";
import { ModuleEditDialog } from "./shared/ModuleEditDialog";

interface EditModuleProps {
  courseId: string;
  superModuleId: string;
  moduleId: string;
}

export function EditModule({
  courseId,
  superModuleId,
  moduleId,
}: EditModuleProps) {
  const router = useRouter();
  const { data, isLoading } = useGetModuleById(moduleId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`/admin/courses/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <ModuleEditDialog
      open={true}
      onOpenChange={handleOpenChange}
      module={(data?.data as IModule) || null} // <-- Cast it to IModule here
    />
  );
}
