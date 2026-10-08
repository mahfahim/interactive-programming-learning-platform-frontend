"use client";

import { BookOpen, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IModule } from "@/types";

interface ModuleStatsProps {
  modules: IModule[];
}

export function ModuleStats({ modules }: ModuleStatsProps) {
  const totalModules = modules.length;
  const totalLessons = modules.reduce((acc, mod) => {
    return acc + (Array.isArray(mod.lessons) ? mod.lessons.length : 0);
  }, 0);

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Card className="border-border/60 bg-card/50">
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Modules
            </p>
            <p className="text-lg font-bold text-foreground">{totalModules}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/50">
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10 text-secondary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Lessons
            </p>
            <p className="text-lg font-bold text-foreground">{totalLessons}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
