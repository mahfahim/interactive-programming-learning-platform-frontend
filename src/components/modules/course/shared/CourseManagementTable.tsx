"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
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
import type { ICourse } from "@/types";

interface CourseManagementTableProps {
  courses: ICourse[];
  viewUrlPrefix: string;
  editUrlPrefix?: string;
  builderUrlPrefix?: string;
  onDeleteClick?: (course: ICourse) => void;
}

export function CourseManagementTable({
  courses,
  viewUrlPrefix,
  editUrlPrefix,
  onDeleteClick,
}: CourseManagementTableProps) {
  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.map((course) => {
            const priceNum =
              typeof course.price === "string"
                ? parseFloat(course.price)
                : course.price;

            const priceStr =
              Number.isNaN(priceNum) || priceNum <= 0
                ? "Free"
                : `$${priceNum.toFixed(2)}`;

            return (
              <TableRow key={course.id}>
                <TableCell className="font-semibold max-w-xs truncate">
                  {course.title}
                  <div className="text-xs text-muted-foreground font-normal truncate">
                    {course.slug}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="text-[11px] capitalize">
                    {course.description?.level?.toLowerCase() || "N/A"}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm capitalize">
                  {course.description?.language?.toLowerCase() || "N/A"}
                </TableCell>

                <TableCell className="font-medium text-sm">
                  {priceStr}
                </TableCell>

                <TableCell className="text-sm">
                  {course.enrollmentCount ?? 0}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {new Date(course.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right space-x-1 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="View Course"
                  >
                    <Link href={`${viewUrlPrefix}/${course.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  {editUrlPrefix && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Edit Course"
                    >
                      <Link href={`${editUrlPrefix}/${course.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete Course"
                      onClick={() => onDeleteClick(course)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
