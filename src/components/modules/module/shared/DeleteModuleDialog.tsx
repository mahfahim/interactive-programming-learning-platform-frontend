"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteModule } from "@/hooks/module.hook";
import type { IModule } from "@/types";

interface DeleteModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: IModule | null;
}

export function DeleteModuleDialog({
  open,
  onOpenChange,
  module,
}: DeleteModuleDialogProps) {
  const deleteModuleMutation = useDeleteModule({
    onSuccess: (res) => {
      toast.success(res?.message || "Module deleted successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete module");
    },
  });

  if (!module) return null;

  const handleDelete = () => {
    deleteModuleMutation.mutate(module.id);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the module{" "}
            <span className="font-semibold text-foreground">
              "{module.title}"
            </span>{" "}
            and remove all attached lessons. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteModuleMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteModuleMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteModuleMutation.isPending ? "Deleting..." : "Delete Module"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
