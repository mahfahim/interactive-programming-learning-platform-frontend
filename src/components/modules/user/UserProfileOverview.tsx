"use client";

import { UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IUserProfileResponse } from "@/types";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { SkillsSection } from "./SkillsSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { UserEmptyState } from "./UserEmptyState";
import { WebsitesSection } from "./WebsitesSection";

interface UserProfileOverviewProps {
  profile: IUserProfileResponse;
  isOwnProfile?: boolean;
}

export function UserProfileOverview({
  profile,
  isOwnProfile = false,
}: UserProfileOverviewProps) {
  const desc = profile.description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">About & Bio</CardTitle>
          </CardHeader>
          <CardContent>
            {desc?.bio ? (
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                {desc.bio}
              </p>
            ) : (
              <UserEmptyState
                title="No bio added"
                description="Add a short summary about your expertise and goals."
                icon={UserCheck}
              />
            )}
          </CardContent>
        </Card>

        <ExperienceSection
          experiences={desc?.experiences}
          isEditable={isOwnProfile}
        />
        <EducationSection
          educations={desc?.educations}
          isEditable={isOwnProfile}
        />
      </div>

      <div className="space-y-6">
        <SkillsSection skills={desc?.skills} isEditable={isOwnProfile} />
        <SocialLinksSection socials={desc?.socials} isEditable={isOwnProfile} />
        <WebsitesSection websites={desc?.websites} isEditable={isOwnProfile} />
      </div>
    </div>
  );
}
