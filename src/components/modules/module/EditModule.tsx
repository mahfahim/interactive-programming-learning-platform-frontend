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
  isInstructor?: boolean;
  isAdmin?: boolean;
}

export function EditModule({
  courseId,
  superModuleId,
  moduleId,
  isInstructor = false,
  isAdmin = false,
}: EditModuleProps) {
  const router = useRouter();
  const { data, isLoading } = useGetModuleById(moduleId);

  // Dynamic Route Prefix Logic
  const basePath = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/admin";

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`${basePath}/courses/${courseId}`);
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
      module={(data?.data as IModule) || null}
    />
  );
}