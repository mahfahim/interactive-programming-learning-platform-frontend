// src/app/(dashboard)/student/profile/page.tsx
import ProfileSettings from "@/components/modules/user/ProfileSettings";

export const metadata = {
  title: "Profile Settings | Student Dashboard",
  description: "Manage your profile information and social connections",
};

export default function StudentProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ProfileSettings />
    </div>
  );
}
