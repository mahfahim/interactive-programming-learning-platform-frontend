"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ICreateSuperModuleInput,
  ISuperModule,
  IUpdateSuperModuleInput,
} from "@/types";
import {
  createSuperModuleSchema,
  updateSuperModuleSchema,
} from "@/validation/superModule.validation";

interface SuperModuleFormProps {
  courseId: string;
  initialData?: ISuperModule | null;
  onSubmitCreate?: (data: ICreateSuperModuleInput) => void;
  onSubmitUpdate?: (data: IUpdateSuperModuleInput) => void;
  isPending?: boolean;
  onCancel?: () => void;
}

export function SuperModuleForm({
  courseId,
  initialData,
  onSubmitCreate,
  onSubmitUpdate,
  isPending = false,
  onCancel,
}: SuperModuleFormProps) {
  const isEdit = !!initialData;

  const createForm = useForm<ICreateSuperModuleInput>({
    resolver: zodResolver(createSuperModuleSchema),
    defaultValues: {
      courseId,
      title: initialData?.title || "",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  });

  const updateForm = useForm<IUpdateSuperModuleInput>({
    resolver: zodResolver(updateSuperModuleSchema),
    defaultValues: {
      title: initialData?.title || "",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  });

  const handleCreateSubmit = (data: ICreateSuperModuleInput) => {
    onSubmitCreate?.({ ...data, courseId });
  };

  const handleUpdateSubmit = (data: IUpdateSuperModuleInput) => {
    onSubmitUpdate?.(data);
  };

  if (isEdit) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = updateForm;

    return (
      <form
        onSubmit={handleSubmit(handleUpdateSubmit)}
        className="space-y-4 pt-2"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="edit-title"
            className="text-sm font-medium text-foreground"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="edit-title"
            {...register("title")}
            placeholder="e.g. Super Module 1: Advanced Concepts"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="edit-display-order"
            className="text-sm font-medium text-foreground"
          >
            Display Order
          </label>
          <Input
            id="edit-display-order"
            type="number"
            {...register("displayOrder", { valueAsNumber: true })}
            placeholder="1"
            className={errors.displayOrder ? "border-destructive" : ""}
          />
          {errors.displayOrder && (
            <p className="text-xs text-destructive">
              {errors.displayOrder.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = createForm;

  return (
    <form
      onSubmit={handleSubmit(handleCreateSubmit)}
      className="space-y-4 pt-2"
    >
      <input type="hidden" {...register("courseId")} value={courseId} />

      <div className="space-y-1.5">
        <label
          htmlFor="create-title"
          className="text-sm font-medium text-foreground"
        >
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="create-title"
          {...register("title")}
          placeholder="e.g. Super Module 1: C++ Fundamentals"
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="create-display-order"
          className="text-sm font-medium text-foreground"
        >
          Display Order
        </label>
        <Input
          id="create-display-order"
          type="number"
          {...register("displayOrder", { valueAsNumber: true })}
          placeholder="1"
          className={errors.displayOrder ? "border-destructive" : ""}
        />
        {errors.displayOrder && (
          <p className="text-xs text-destructive">
            {errors.displayOrder.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Super Module
        </Button>
      </div>
    </form>
  );
}
