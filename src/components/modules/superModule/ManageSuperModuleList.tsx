"use client";

import { useMemo, useState } from "react";
import { useGetSuperModulesByCourse } from "@/hooks/superModule.hook";
import type { ISuperModule } from "@/types";
import { SuperModuleCreateDialog } from "./SuperModuleCreateDialog";
import { DeleteSuperModuleDialog } from "./shared/DeleteSuperModuleDialog";
import { SuperModuleCard } from "./shared/SuperModuleCard";
import { SuperModuleEditDialog } from "./shared/SuperModuleEditDialog";
import { SuperModuleEmptyState } from "./shared/SuperModuleEmptyState";
import { SuperModuleErrorState } from "./shared/SuperModuleErrorState";
import { SuperModuleHeader } from "./shared/SuperModuleHeader";
import { SuperModuleSkeleton } from "./shared/SuperModuleSkeleton";
import { SuperModuleStats } from "./shared/SuperModuleStats";
import { SuperModuleTableView } from "./shared/SuperModuleTableView";

interface ManageSuperModuleListProps {
  courseId: string;
  isInstructor?: boolean;
  isAdmin?: boolean;
  showStats?: boolean;
  onAddModuleClick?: (superModuleId: string) => void;
}

export function ManageSuperModuleList({
  courseId,
  isInstructor = false,
  isAdmin = true,
  showStats = true,
  onAddModuleClick,
}: ManageSuperModuleListProps) {
  // isAdmin মিথ্যা হলে স্বয়ংক্রিয়ভাবে isInstructor সত্য ধরে নেওয়ার সেফগার্ড
  const effectiveIsInstructor = isInstructor || !isAdmin;
  const canManage = effectiveIsInstructor || isAdmin;

  const { data, isLoading, isError, refetch } =
    useGetSuperModulesByCourse(courseId);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // CRUD Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSuperModule, setEditingSuperModule] =
    useState<ISuperModule | null>(null);
  const [deletingSuperModule, setDeletingSuperModule] =
    useState<ISuperModule | null>(null);

  const superModules: ISuperModule[] = useMemo(() => {
    if (!data?.data) return [];
    return Array.isArray(data.data) ? data.data : [data.data];
  }, [data]);

  const filteredSuperModules = useMemo(() => {
    return superModules
      .filter((sm) =>
        sm.title.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [superModules, searchTerm]);

  if (isLoading) {
    return <SuperModuleSkeleton count={3} />;
  }

  if (isError) {
    return <SuperModuleErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <SuperModuleHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateClick={() => setIsCreateOpen(true)}
        isInstructor={canManage}
      />

      {showStats && superModules.length > 0 && (
        <SuperModuleStats superModules={superModules} />
      )}

      {filteredSuperModules.length === 0 ? (
        <SuperModuleEmptyState
          onCreateClick={() => setIsCreateOpen(true)}
          isInstructor={canManage}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuperModules.map((sm) => (
            <SuperModuleCard
              key={sm.id}
              superModule={sm}
              isInstructor={effectiveIsInstructor}
              isAdmin={isAdmin}
              onEdit={setEditingSuperModule}
              onDelete={setDeletingSuperModule}
              onAddModule={onAddModuleClick}
            />
          ))}
        </div>
      ) : (
        <SuperModuleTableView
          superModules={filteredSuperModules}
          courseId={courseId}
          isInstructor={effectiveIsInstructor}
          isAdmin={isAdmin}
          onEdit={setEditingSuperModule}
          onDelete={setDeletingSuperModule}
          onAddModule={onAddModuleClick}
        />
      )}

      {canManage && (
        <>
          <SuperModuleCreateDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            courseId={courseId}
            isInstructor={effectiveIsInstructor}
            isAdmin={isAdmin}
          />

          <SuperModuleEditDialog
            open={!!editingSuperModule}
            onOpenChange={(open) => !open && setEditingSuperModule(null)}
            superModule={editingSuperModule}
          />

          <DeleteSuperModuleDialog
            open={!!deletingSuperModule}
            onOpenChange={(open) => !open && setDeletingSuperModule(null)}
            superModule={deletingSuperModule}
          />
        </>
      )}
    </div>
  );
}