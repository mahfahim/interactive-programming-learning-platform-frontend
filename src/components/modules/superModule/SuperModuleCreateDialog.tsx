"use client";

import { useRouter } from "next/navigation";
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
  isInstructor?: boolean;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export function SuperModuleCreateDialog({
  open,
  onOpenChange,
  courseId,
  isInstructor = false,
  isAdmin = false,
  onSuccess,
}: SuperModuleCreateDialogProps) {
  const router = useRouter();

  // Admin হলে /admin, Instructor হলে /instructor এবং ডিফল্ট হিসেবে /admin নির্ধারণ করা হলো
  const basePath = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/admin";

  const { mutate: createSuperModule, isPending } = useCreateSuperModule({
    onSuccess: (data: any) => {
      onOpenChange(false);
      onSuccess?.();

      // তৈরি হওয়া Super Module-এর ID পাওয়া গেলে সেই পেইজে রিডাইরেক্ট করবে
      const createdId = data?.data?.id || data?.id;
      if (createdId) {
        router.push(`${basePath}/courses/${courseId}/super-modules/${createdId}`);
      }
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