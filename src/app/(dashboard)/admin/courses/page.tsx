import { AdminCourseManagement } from "@/components/modules/course/CourseManagement";
import { Role } from "@/types/enum.type";

export const metadata = {
  title: "Course Management | Admin Dashboard",
  description: "Manage, edit, and create courses across the platform.",
};

export default function AdminCoursesPage() {
  return <AdminCourseManagement role={Role.ADMIN} urlPrefix="/admin/courses" />;
}
