"use client";

import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateSuperModule } from "@/hooks/superModule.hook";
import type { ICreateSuperModuleInput } from "@/types";
import { SuperModuleForm } from "./shared/SuperModuleForm";

interface SuperModuleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onSuccess?: () => void;
}

export function SuperModuleCreateDialog({
  open,
  onOpenChange,
  courseId,
  onSuccess,
}: SuperModuleCreateDialogProps) {
  const { mutate: createSuperModule, isPending } = useCreateSuperModule({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleCreate = (data: ICreateSuperModuleInput) => {
    createSuperModule(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create Super Module
          </DialogTitle>
          <DialogDescription>
            Add a top-level grouping to organize modules and lessons within this
            course.
          </DialogDescription>
        </DialogHeader>

        <SuperModuleForm
          courseId={courseId}
          onSubmitCreate={handleCreate}
          isPending={isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
