import { ManageModuleList } from "@/components/modules/module/ManageModuleList";

interface PageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  isInstructor?: boolean;
  isAdmin?: boolean;
}

export default async function AdminSuperModuleDetailsPage({
  params,
  isInstructor = false,
  isAdmin = true,
}: PageProps) {
  const { courseId, superModuleId } = await params;

  return (
    <div className="container mx-auto py-6">
      <ManageModuleList
        superModuleId={superModuleId}
        courseId={courseId}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
    </div>
  );
}
