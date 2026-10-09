"use client";

import { BookOpen, Edit, Eye, FolderPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ISuperModule } from "@/types";

interface SuperModuleTableViewProps {
  superModules: ISuperModule[];
  courseId: string;
  isInstructor?: boolean;
  isAdmin?: boolean;
  onEdit?: (superModule: ISuperModule) => void;
  onDelete?: (superModule: ISuperModule) => void;
  onAddModule?: (superModuleId: string) => void;
}

export function SuperModuleTableView({
  superModules,
  courseId,
  isInstructor = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onAddModule,
}: SuperModuleTableViewProps) {
  const canManage = isInstructor || isAdmin;
  
  // Dynamic Route Prefix Logic
  const basePath = isInstructor ? "/instructor" : "/admin";

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-20 text-center font-semibold">
              Order
            </TableHead>
            <TableHead className="font-semibold">
              Super Module Title & Description
            </TableHead>
            <TableHead className="w-36 text-center font-semibold">
              Modules
            </TableHead>
            <TableHead className="w-56 text-right font-semibold pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {superModules.map((sm) => {
            const moduleCount = sm.modules?.length || 0;

            return (
              <TableRow
                key={sm.id}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* Order Badge */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs font-semibold bg-muted/60"
                  >
                    #{sm.displayOrder}
                  </Badge>
                </TableCell>

                {/* Title & Description */}
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`${basePath}/courses/${courseId}/super-modules/${sm.id}`}
                      className="font-semibold text-sm text-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {sm.title}
                    </Link>
                    {sm.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {sm.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Module Count */}
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className="gap-1 font-normal text-xs"
                  >
                    <BookOpen className="h-3 w-3 text-primary" />
                    {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
                  </Badge>
                </TableCell>

                {/* Actions (CRUD) */}
                <TableCell className="text-right pr-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Details / Read */}
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="View Details"
                    >
                      <Link
                        href={`${basePath}/courses/${courseId}/super-modules/${sm.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    {canManage && (
                      <>
                        {onAddModule && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAddModule(sm.id)}
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            title="Add Module"
                          >
                            <FolderPlus className="h-4 w-4" />
                          </Button>
                        )}

                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(sm)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Edit Super Module"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(sm)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete Super Module"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}