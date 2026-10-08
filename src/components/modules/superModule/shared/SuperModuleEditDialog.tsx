"use client";

import { Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateSuperModule } from "@/hooks/superModule.hook";
import type { ISuperModule, IUpdateSuperModuleInput } from "@/types";
import { SuperModuleForm } from "./SuperModuleForm";

interface SuperModuleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  superModule: ISuperModule | null;
  onSuccess?: () => void;
}

export function SuperModuleEditDialog({
  open,
  onOpenChange,
  superModule,
  onSuccess,
}: SuperModuleEditDialogProps) {
  const { mutate: updateSuperModule, isPending } = useUpdateSuperModule({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleUpdate = (payload: IUpdateSuperModuleInput) => {
    if (superModule) {
      updateSuperModule({ id: superModule.id, payload });
    }
  };

  if (!superModule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Edit3 className="h-5 w-5 text-primary" />
            Edit Super Module
          </DialogTitle>
          <DialogDescription>
            Update title and display order for this super module.
          </DialogDescription>
        </DialogHeader>

        <SuperModuleForm
          courseId={superModule.courseId}
          initialData={superModule}
          onSubmitUpdate={handleUpdate}
          isPending={isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
