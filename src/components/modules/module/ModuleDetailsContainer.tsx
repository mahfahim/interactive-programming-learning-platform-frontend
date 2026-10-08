"use client";

import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModuleById } from "@/hooks/module.hook";
import type { IModule } from "@/types"; // <-- Import IModule here
import { DeleteModuleDialog } from "./shared/DeleteModuleDialog";
import { ModuleCard } from "./shared/ModuleCard";
import { ModuleEditDialog } from "./shared/ModuleEditDialog";
import { ModuleEmptyState } from "./shared/ModuleEmptyState";

interface ModuleDetailsContainerProps {
  courseId: string;
  superModuleId: string;
  moduleId: string;
}

export function ModuleDetailsContainer({
  courseId,
  superModuleId,
  moduleId,
}: ModuleDetailsContainerProps) {
  const { data, isLoading, isError } = useGetModuleById(moduleId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Cast the response to IModule to satisfy TypeScript
  const moduleData = data?.data as IModule;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !moduleData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <ModuleEmptyState canManage={false} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Back Navigation & Action Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href={`/admin/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" /> Back to Course
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="gap-1.5"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Module Information Card */}
      <ModuleCard
        module={moduleData}
        canManage={true}
        courseId={courseId}
        superModuleId={superModuleId}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* Dialog Modals */}
      <ModuleEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        module={moduleData}
      />

      <DeleteModuleDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        module={moduleData}
      />
    </div>
  );
}
