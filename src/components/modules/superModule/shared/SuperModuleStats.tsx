"use client";

import { BookOpen, Layers, ListOrdered } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ISuperModule } from "@/types";

interface SuperModuleStatsProps {
  superModules: ISuperModule[];
}

export function SuperModuleStats({ superModules }: SuperModuleStatsProps) {
  const totalSuperModules = superModules.length;
  const totalModules = superModules.reduce(
    (acc, sm) => acc + (sm.modules?.length || 0),
    0,
  );
  const maxDisplayOrder = superModules.reduce(
    (max, sm) => (sm.displayOrder > max ? sm.displayOrder : max),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Super Modules
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {totalSuperModules}
            </h4>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Nested Modules
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {totalModules}
            </h4>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <ListOrdered className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Highest Display Order
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {maxDisplayOrder}
            </h4>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
