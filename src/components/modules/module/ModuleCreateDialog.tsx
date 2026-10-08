"use client";

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
}

export function ModuleCreateDialog({
  open,
  onOpenChange,
  superModuleId,
}: ModuleCreateDialogProps) {
  const createModuleMutation = useCreateModule({
    onSuccess: (res) => {
      toast.success(res.message || "Module created successfully");
      onOpenChange(false);
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
