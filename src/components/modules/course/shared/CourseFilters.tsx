// src/components/modules/course/CourseFilters.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseLevel } from "@/types/enum.type";

interface CourseFiltersProps {
  search: string;
  level?: CourseLevel | "ALL";
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onLevelChange: (value: CourseLevel | "ALL") => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function CourseFilters({
  search,
  level = "ALL",
  sortBy,
  sortOrder,
  onSearchChange,
  onLevelChange,
  onSortChange,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
        <Select
          value={level}
          onValueChange={(val) => onLevelChange(val as CourseLevel | "ALL")}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value={CourseLevel.BEGINNER}>Beginner</SelectItem>
            <SelectItem value={CourseLevel.INTERMEDIATE}>
              Intermediate
            </SelectItem>
            <SelectItem value={CourseLevel.ADVANCED}>Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(val) => {
            const [by, order] = val.split("-");
            onSortChange(by, order as "asc" | "desc");
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
