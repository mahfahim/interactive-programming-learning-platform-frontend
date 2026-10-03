"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSoftDeleteUser } from "@/hooks/user.hook";

interface DeleteUserDialogProps {
  userId: string;
  userName?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const { mutate: softDelete, isPending } = useSoftDeleteUser();

  const handleDelete = () => {
    softDelete(userId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle>Soft Delete Account</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to soft delete{" "}
            <strong>{userName || "this user"}</strong>? The user account will be
            marked as deleted and deactivated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
