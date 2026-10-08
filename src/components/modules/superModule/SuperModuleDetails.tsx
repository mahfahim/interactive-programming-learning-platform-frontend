// src/components/modules/superModule/SuperModuleDetails.tsx

"use client";

import { ArrowLeft, BookOpen, ChevronRight, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSuperModuleById } from "@/hooks/superModule.hook";
import type { ISuperModule } from "@/types";
import { SuperModuleErrorState } from "./shared/SuperModuleErrorState";
import { SuperModuleSkeleton } from "./shared/SuperModuleSkeleton";

interface SuperModuleDetailsProps {
  courseId: string;
  id: string;
}

export function SuperModuleDetails({ courseId, id }: SuperModuleDetailsProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetSuperModuleById(id);

  if (isLoading) {
    return <SuperModuleSkeleton count={1} />;
  }

  if (isError || !data?.data) {
    return (
      <SuperModuleErrorState
        message="Could not retrieve super module details."
        onRetry={refetch}
      />
    );
  }

  const superModule = data.data as unknown as ISuperModule;
  const modules = superModule.modules || [];

  return (
    <div className="space-y-6">
      {/* Top Header Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/courses/${courseId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Button>

        <Button
          size="sm"
          onClick={() =>
            router.push(
              `/admin/courses/${courseId}/super-modules/${id}/modules/create`,
            )
          }
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Module
        </Button>
      </div>

      {/* Super Module Details Card */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="font-mono text-xs font-semibold"
            >
              Display Order #{superModule.displayOrder}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Super Module ID: {superModule.id.slice(0, 8)}...
            </span>
          </div>
          <CardTitle className="text-xl font-bold mt-2 text-foreground">
            {superModule.title}
          </CardTitle>
          {superModule.description && (
            <p className="text-sm text-muted-foreground pt-1">
              {superModule.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Nested Modules ({modules.length})
          </h4>

          {modules.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No nested modules configured yet.
            </p>
          ) : (
            <div className="space-y-3">
              {modules.map((m) => (
                <Link
                  key={m.id}
                  href={`/admin/courses/${courseId}/super-modules/${id}/modules/${m.id}/lessons`}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3 hover:border-primary/50 hover:bg-muted/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {m.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Display Order: {m.displayOrder}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {m.lessons?.length || 0} Lessons
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
