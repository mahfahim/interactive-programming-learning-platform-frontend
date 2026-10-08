// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/page.tsx

import { ModuleList } from "@/components/modules/module/AdminModuleList";

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
      <ModuleList
        superModuleId={superModuleId}
        courseId={courseId}
        canManage={true}
      />
    </div>
  );
}
