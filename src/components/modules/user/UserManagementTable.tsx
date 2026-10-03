"use client";

import { ChevronLeft, ChevronRight, Edit2, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllUsers } from "@/hooks/user.hook";
import type { IUserFilterRequest, User } from "@/types";
import { formatDate } from "@/utils/date.util";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserEditDialog } from "./UserEditDialog";
import { UserErrorState } from "./UserErrorState";
import { UserFilters } from "./UserFilters";
import { UserLoadingSkeleton } from "./UserLoadingSkeleton";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

export function UserManagementTable() {
  const [filters, setFilters] = useState<IUserFilterRequest>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(
    null,
  );
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<User | null>(null);

  const { data, isLoading, isError, error, refetch } = useGetAllUsers(filters);

  if (isLoading) return <UserLoadingSkeleton />;
  if (isError)
    return (
      <UserErrorState message={error?.message} onRetry={() => refetch()} />
    );

  const users = (data?.data as unknown as User[]) || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <UserFilters filters={filters} onChange={setFilters} />

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border">
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.name || "User"}
                            fill
                            sizes="36px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          user.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-none">
                          {user.name || "Unnamed User"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="View Profile"
                      >
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Account"
                        onClick={() => setSelectedUserForEdit(user)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Soft Delete"
                        onClick={() => setSelectedUserForDelete(user)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found matching current filter parameters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total accounts)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setFilters({ ...filters, page: meta.page - 1 })}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setFilters({ ...filters, page: meta.page + 1 })}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {selectedUserForEdit && (
        <UserEditDialog
          user={selectedUserForEdit}
          open={!!selectedUserForEdit}
          onOpenChange={(open) => !open && setSelectedUserForEdit(null)}
        />
      )}

      {selectedUserForDelete && (
        <DeleteUserDialog
          userId={selectedUserForDelete.id}
          userName={selectedUserForDelete.name}
          open={!!selectedUserForDelete}
          onOpenChange={(open) => !open && setSelectedUserForDelete(null)}
        />
      )}
    </div>
  );
}
