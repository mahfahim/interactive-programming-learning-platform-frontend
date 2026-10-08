"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteSuperModule } from "@/hooks/superModule.hook";
import type { ISuperModule } from "@/types";

interface DeleteSuperModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  superModule: ISuperModule | null;
  onSuccess?: () => void;
}

export function DeleteSuperModuleDialog({
  open,
  onOpenChange,
  superModule,
  onSuccess,
}: DeleteSuperModuleDialogProps) {
  const { mutate: deleteSuperModule, isPending } = useDeleteSuperModule({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    if (superModule) {
      deleteSuperModule(superModule.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Super Module
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{superModule?.title}&quot;
            </span>
            ? This action cannot be undone and will detach or remove associated
            sub-modules and lessons.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Super Module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
