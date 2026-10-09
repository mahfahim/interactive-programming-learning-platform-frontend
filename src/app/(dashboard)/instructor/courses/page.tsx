import { AdminCourseManagement } from "@/components/modules/course/CourseManagement";
import { Role } from "@/types/enum.type";

export const metadata = {
  title: "My Courses | Instructor Dashboard",
  description: "Manage and update your instructor courses.",
};

export default function InstructorCoursesPage() {
  return (
    <AdminCourseManagement role={Role.INSTRUCTOR} urlPrefix="/instructor/courses" />
  );
}
