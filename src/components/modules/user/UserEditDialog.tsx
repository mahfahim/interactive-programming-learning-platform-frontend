"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAdminUpdateUser } from "@/hooks/user.hook";
import { type IAdminUpdateUserDto, Role, type User, UserStatus } from "@/types";
import { UserValidation } from "@/validation/user.validation";

interface UserEditDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
}: UserEditDialogProps) {
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState<Role>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: updateUser, isPending } = useAdminUpdateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload: IAdminUpdateUserDto = {
      name: name.trim() || undefined,
      role,
      status,
    };

    const result = UserValidation.adminUpdateUserSchema.safeParse(payload);
    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message || "Validation error");
      return;
    }

    updateUser(
      { id: user.id, payload },
      {
        onSuccess: () => onOpenChange(false),
        onError: (err) =>
          setErrorMessage(err.message || "Failed to update user."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Update User Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 text-sm rounded bg-destructive/10 text-destructive font-medium">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="edit-user-name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="edit-user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-user-role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="edit-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full p-2 border rounded-md bg-background text-sm"
            >
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-user-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="edit-user-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full p-2 border rounded-md bg-background text-sm"
            >
              {Object.values(UserStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
