"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SuperModuleEditDialog } from "@/components/modules/superModule/shared/SuperModuleEditDialog";
import { Button } from "@/components/ui/button";
import { useGetSuperModuleById } from "@/hooks/superModule.hook";
import type { ISuperModule } from "@/types";

interface EditSuperModuleProps {
  courseId: string;
  superModuleId: string;
}

export function EditSuperModule({
  courseId,
  superModuleId,
}: EditSuperModuleProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetSuperModuleById(superModuleId);
  const superModule = (data?.data as unknown as ISuperModule) || null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`/admin/courses/${courseId}`);
    }
  };

  const handleSuccess = () => {
    router.push(`/admin/courses/${courseId}`);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !superModule) {
    return (
      <div className="space-y-4 p-6 text-center">
        <p className="font-semibold text-destructive">
          Super module details could not be found.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/courses/${courseId}`)}
        >
          Back to Course Details
        </Button>
      </div>
    );
  }

  return (
    <SuperModuleEditDialog
      open={true}
      onOpenChange={handleOpenChange}
      superModule={superModule}
      onSuccess={handleSuccess}
    />
  );
}
