// src/app/(dashboard)/admin/users/page.tsx

import AdminUserTable from "@/components/modules/user/AdminUserTable";

export const metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage system users, roles, and account statuses",
};

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminUserTable />
    </div>
  );
}