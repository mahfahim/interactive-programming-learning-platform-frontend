// src/components/modules/course/CourseCard.tsx

import { ArrowRight, Globe, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { ICourse } from "@/types";

function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(num) || num <= 0) return "Free";
  return `$${num.toFixed(2)}`;
}

interface CourseCardProps {
  course: ICourse;
  detailUrlPrefix?: string;
  actions?: React.ReactNode; 
}

export function CourseCard({
  course,
  detailUrlPrefix = "/courses",
  actions,
}: CourseCardProps) {
  const level = course.description?.level || "BEGINNER";
  const language = course.description?.language || "ENGLISH";
  const priceDisplay = formatPrice(course.price);

  return (
    <Card className="group overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-border h-full">
      <div>
        {/* Cover Image Container */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {course.coverImageUrl ? (
            <Image
              src={course.coverImageUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/20 text-primary font-bold text-lg p-4 text-center">
              {course.title}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant={priceDisplay === "Free" ? "secondary" : "default"}
              className="font-semibold shadow"
            >
              {priceDisplay}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 pb-2 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Badge
              variant="outline"
              className="text-[10px] tracking-wide uppercase"
            >
              {level}
            </Badge>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {language}
            </span>
          </div>

          <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {course.description?.shortDescription || "No description provided."}
          </p>
        </CardContent>
      </div>

      <div className="flex flex-col">
        <CardFooter className="p-4 pt-3 border-t flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground font-medium">
            <Users className="h-4 w-4" />
            <span>{course.enrollmentCount || 0} students</span>
          </div>

          <Button size="sm" asChild className="gap-1 group/btn">
            <Link href={`${detailUrlPrefix}/${course.id}`}>
              View Details
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </CardFooter>

        {/* Admin/Instructor */}
        {actions && (
          <div className="p-2.5 bg-muted/40 border-t flex items-center justify-between gap-2">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}