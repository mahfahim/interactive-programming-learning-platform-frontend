// src/components/modules/course/CourseHero.tsx

import { BookOpen, Clock, Globe, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ICourse } from "@/types";

interface CourseHeroProps {
  course: ICourse;
  onEnroll?: () => void;
  enrollLabel?: string;
}

export function CourseHero({
  course,
  onEnroll,
  enrollLabel = "Enroll Now",
}: CourseHeroProps) {
  const price =
    typeof course.price === "string" ? parseFloat(course.price) : course.price;
  const isFree = isNaN(price) || price <= 0;

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="uppercase font-semibold tracking-wider"
          >
            {course.description?.level || "BEGINNER"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {course.description?.language || "ENGLISH"}
          </Badge>
        </div>

        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          {course.title}
        </h1>

        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
          {course.description?.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground font-medium border-t">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {course.enrollmentCount} Enrolled Students
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Self-paced
          </span>
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            {course.superModules?.length || 0} Modules
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-muted/40 rounded-lg border text-center space-y-4">
        <div className="relative w-full h-44 rounded-md overflow-hidden bg-muted">
          {course.coverImageUrl ? (
            <Image
              src={course.coverImageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold p-4">
              {course.title}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase text-muted-foreground font-semibold">
            Course Price
          </span>
          <div className="text-3xl font-extrabold text-primary">
            {isFree ? "Free" : `$${price.toFixed(2)}`}
          </div>
        </div>

        {onEnroll && (
          <Button
            size="lg"
            className="w-full font-bold shadow"
            onClick={onEnroll}
          >
            {enrollLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
