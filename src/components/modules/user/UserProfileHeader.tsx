"use client";

import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Shield,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IUserProfileResponse } from "@/types";
import { formatDate } from "@/utils/date.util";
import { ProfileImageUploader } from "./ProfileImageUploader";
import { UserProfileEditDialog } from "./UserProfileEditDialog";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserProfileHeaderProps {
  profile: IUserProfileResponse;
  isOwnProfile?: boolean;
}

export function UserProfileHeader({
  profile,
  isOwnProfile = false,
}: UserProfileHeaderProps) {
  const cityName = profile.description?.city?.name;

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="h-32 bg-linear-to-r from-slate-900 via-indigo-900 to-blue-900" />
      <CardContent className="relative pt-0 pb-6 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-14 mb-4 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <ProfileImageUploader
              currentImageUrl={profile.imageUrl}
              name={profile.name}
              editable={isOwnProfile}
            />
            <div className="text-center sm:text-left mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {profile.name || "User"}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <UserRoleBadge role={profile.role} />
                <UserStatusBadge status={profile.status} />
                {cityName && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    {cityName}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile && <UserProfileEditDialog profile={profile} />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>Joined {formatDate(profile.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {profile.emailVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Email Verified
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  Unverified Email
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span className="capitalize">
              {profile.authProvider.toLowerCase()} Auth
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
