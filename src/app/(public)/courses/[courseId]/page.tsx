import { StudentSuperModuleList } from "@/components/modules/superModule/StudentSuperModuleList";

interface CourseDetailsPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function StudentCourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Course Curriculum & Content
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse course modules and track your learning progress.
        </p>
      </div>

      {/* Read-Only Student View */}
      <StudentSuperModuleList courseId={courseId} />
    </div>
  );
}
