"use client";

import { useMemo, useState } from "react";
// Module Hook Import
import { useGetModulesBySuperModule } from "@/hooks/module.hook";
import type { IModule, ISuperModule } from "@/types";
// Dialogs Import
import { ModuleCreateDialog } from "./ModuleCreateDialog";
import { DeleteModuleDialog } from "./shared/DeleteModuleDialog";
import { ModuleAccordion } from "./shared/ModuleAccordion";
import { ModuleDetails } from "./shared/ModuleDetails";
import { ModuleEditDialog } from "./shared/ModuleEditDialog";
import { ModuleEmptyState } from "./shared/ModuleEmptyState";
import { ModuleErrorState } from "./shared/ModuleErrorState";
// Sub-components Import
import { ModuleHeader } from "./shared/ModuleHeader";
import { ModuleSkeleton } from "./shared/ModuleSkeleton";
import { ModuleStats } from "./shared/ModuleStats";

interface AdminModuleListProps {
  superModuleId: string;
  courseId?: string;
  showStats?: boolean;
}

export function AdminModuleList({
  superModuleId,
  courseId,
  showStats = true,
}: AdminModuleListProps) {
  // 1. Data Fetching via React Query Hook
  const {
    data: modulesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetModulesBySuperModule(superModuleId);

  // 2. Dialog / Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedModuleForEdit, setSelectedModuleForEdit] =
    useState<IModule | null>(null);
  const [selectedModuleForDelete, setSelectedModuleForDelete] =
    useState<IModule | null>(null);
  const [selectedModuleForView, setSelectedModuleForView] =
    useState<IModule | null>(null);

  // 3. Safe Data Extraction
  const modules: IModule[] = useMemo(() => {
    if (!modulesResponse?.data) return [];
    const rawData = modulesResponse.data as IModule[] | ISuperModule;
    return Array.isArray(rawData) ? rawData : rawData.modules || [];
  }, [modulesResponse]);

  // Loading State
  if (isLoading) {
    return <ModuleSkeleton />;
  }

  // Error State with Retry
  if (isError) {
    return (
      <ModuleErrorState
        message="Failed to load modules for this super module."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <ModuleHeader
        title="Modules"
        totalModules={modules.length}
        canManage={true}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* 2. Stats Section */}
      {showStats && modules.length > 0 && <ModuleStats modules={modules} />}

      {/* 3. Main Content Rendering */}
      {modules.length === 0 ? (
        <ModuleEmptyState
          canManage={true}
          onCreateClick={() => setIsCreateOpen(true)}
        />
      ) : (
        <ModuleAccordion
          modules={modules}
          canManage={true}
          courseId={courseId}
          superModuleId={superModuleId}
          isStudent={false}
          onEdit={(m) => setSelectedModuleForEdit(m)}
          onDelete={(m) => setSelectedModuleForDelete(m)}
        />
      )}

      {/* --- CRUD Dialogs --- */}
      <ModuleCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        superModuleId={superModuleId}
      />

      <ModuleEditDialog
        open={Boolean(selectedModuleForEdit)}
        onOpenChange={(open) => !open && setSelectedModuleForEdit(null)}
        module={selectedModuleForEdit}
      />

      <DeleteModuleDialog
        open={Boolean(selectedModuleForDelete)}
        onOpenChange={(open) => !open && setSelectedModuleForDelete(null)}
        module={selectedModuleForDelete}
      />

      {/* Details View Dialog */}
      {selectedModuleForView && (
        <ModuleDetails
          open={Boolean(selectedModuleForView)}
          onOpenChange={(open) => !open && setSelectedModuleForView(null)}
          module={selectedModuleForView}
          canManage={true}
          onEdit={(m) => {
            setSelectedModuleForView(null);
            setSelectedModuleForEdit(m);
          }}
        />
      )}
    </div>
  );
}
