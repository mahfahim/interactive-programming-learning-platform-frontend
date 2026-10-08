"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateModule } from "@/hooks/module.hook";
import type { IModule, IUpdateModuleInput } from "@/types";
import { ModuleForm } from "./ModuleForm";

interface ModuleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: IModule | null;
}

export function ModuleEditDialog({
  open,
  onOpenChange,
  module,
}: ModuleEditDialogProps) {
  const updateModuleMutation = useUpdateModule({
    onSuccess: (res) => {
      toast.success(res?.message || "Module updated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update module");
    },
  });

  if (!module) return null;

  const handleSubmit = (data: IUpdateModuleInput) => {
    updateModuleMutation.mutate({
      id: module.id,
      payload: data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            Update title and display order for this module.
          </DialogDescription>
        </DialogHeader>
        <ModuleForm
          superModuleId={module.superModuleId || ""} // Passed required prop (usually on the module object)
          initialData={module}
          onSubmitUpdate={handleSubmit}
          isPending={updateModuleMutation.isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
