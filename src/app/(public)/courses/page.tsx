import { StudentCourseList } from "@/components/modules/course/StudentCourseList";

export const metadata = {
  title: "All Courses | Explore Learning",
  description:
    "Browse and discover programming courses available on the platform.",
};

export default function StudentCoursesPage() {
  return <StudentCourseList urlPrefix="/courses" />;
}
