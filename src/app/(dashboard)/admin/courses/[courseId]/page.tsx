import { ManageSuperModuleList } from "@/components/modules/superModule/ManageSuperModuleList";

interface CourseDetailsPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function AdminCourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Course Modules & Structure
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage super modules, modules, and lessons for this course as an
          Administrator or Instructor.
        </p>
      </div>

      {/* Admin/Instructor View with full CRUD access */}
      <ManageSuperModuleList courseId={courseId} isAdmin={true} />
    </div>
  );
}
