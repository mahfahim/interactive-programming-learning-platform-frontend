"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateModule } from "@/hooks/module.hook";
import type { ICreateModuleInput } from "@/types";
import { ModuleForm } from "./shared/ModuleForm";

interface ModuleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  superModuleId: string;
  courseId?: string;
  isInstructor?: boolean;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export function ModuleCreateDialog({
  open,
  onOpenChange,
  superModuleId,
  courseId,
  isInstructor = false,
  isAdmin = false,
  onSuccess,
}: ModuleCreateDialogProps) {
  const router = useRouter();

  // Dynamic Route Prefix Logic
  const basePath = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/admin";

  const createModuleMutation = useCreateModule({
    onSuccess: (res: any) => {
      toast.success(res?.message || "Module created successfully");
      onOpenChange(false);
      onSuccess?.();

      // Module তৈরি হওয়ার পর রিডাইরেক্ট করবে (যদি courseId থেকে থাকে)
      const createdId = res?.data?.id || res?.id;
      if (createdId && courseId) {
        router.push(
          `${basePath}/courses/${courseId}/super-modules/${superModuleId}/modules/${createdId}/lessons`,
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create module");
    },
  });

  const handleSubmit = (data: ICreateModuleInput) => {
    createModuleMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
          <DialogDescription>
            Add a new module to organize your course contents and lessons.
          </DialogDescription>
        </DialogHeader>

        <ModuleForm
          superModuleId={superModuleId}
          onSubmitCreate={handleSubmit}
          isPending={createModuleMutation.isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}