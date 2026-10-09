// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/page.tsx

import { ManageModuleList } from "@/components/modules/module/ManageModuleList";

interface PageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
  }>;
}

export default async function SuperModuleDetailsPage({ params }: PageProps) {
  const { courseId, superModuleId } = await params;

  return (
    <div className="container mx-auto py-6">
      <ManageModuleList superModuleId={superModuleId} courseId={courseId} />
    </div>
  );
}
