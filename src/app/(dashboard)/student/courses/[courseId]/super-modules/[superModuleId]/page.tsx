import { StudentModuleList } from "@/components/modules/module/StudentModuleList";

interface PageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
  }>;
}

export default async function StudentSuperModuleDetailsPage({
  params,
}: PageProps) {
  const { courseId, superModuleId } = await params;

  return (
    <div className="container mx-auto py-6">
      <StudentModuleList superModuleId={superModuleId} courseId={courseId} />
    </div>
  );
}
