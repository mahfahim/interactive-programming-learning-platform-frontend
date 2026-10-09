"use client";

import { Loader2, Plus, Save, Trash2, Upload, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetMyProfile,
  useSyncMySkills,
  useSyncMySocials,
  useUpdateMyProfile,
  useUploadProfileImage,
} from "@/hooks/user.hook";
import type { IUserProfileResponse, SocialPlatform } from "@/types";

interface LocalSocialItem {
  id: string;
  platform: SocialPlatform;
  url: string;
}

interface LocalSkillItem {
  id: string;
  skillId: string;
  name: string;
  level: string;
}

export default function ProfileSettings() {
  const { data: profileResponse, isLoading } = useGetMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const uploadImageMutation = useUploadProfileImage();
  const syncSocialsMutation = useSyncMySocials();
  const syncSkillsMutation = useSyncMySkills();

  const userProfile = profileResponse?.data as IUserProfileResponse | undefined;

  // Form States
  const [name, setName] = useState(userProfile?.name || "");
  const [bio, setBio] = useState(userProfile?.description?.bio || "");

  // Local States
  const [socials, setSocials] = useState<LocalSocialItem[]>([]);
  const [skills, setSkills] = useState<LocalSkillItem[]>([]);

  // Sync profile data once fetched
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setBio(userProfile.description?.bio || "");

      // Populate Socials
      if (userProfile.description?.socials) {
        setSocials(
          userProfile.description.socials.map((s) => ({
            id: s.id || crypto.randomUUID(),
            platform: s.platform,
            url: s.url,
          })),
        );
      }

      // Populate Skills with skillId
      if (userProfile.description?.skills) {
        setSkills(
          userProfile.description.skills.map((sk: any) => ({
            id: sk.id || crypto.randomUUID(),
            skillId: sk.skillId || sk.id || crypto.randomUUID(),
            name: sk.name || sk.skill?.name || "",
            level: sk.level || "INTERMEDIATE",
          })),
        );
      }
    }
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file, {
        onSuccess: () => toast.success("Profile image updated successfully!"),
        onError: (err) => toast.error(err.message || "Failed to upload image"),
      });
    }
  };

  // Update Profile Info
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { name, bio },
      {
        onSuccess: () => toast.success("Profile info updated!"),
        onError: (err) =>
          toast.error(err.message || "Failed to update profile"),
      },
    );
  };

  // Sync Social Links
  const handleSyncSocials = () => {
    const payloadSocials = socials.map(({ platform, url }) => ({
      platform,
      url,
    }));
    syncSocialsMutation.mutate(
      { socials: payloadSocials },
      {
        onSuccess: () => toast.success("Social links synchronized!"),
        onError: (err) => toast.error(err.message || "Failed to sync socials"),
      },
    );
  };

  // Sync Skills (including skillId to satisfy ISyncSkillItem)
  const handleSyncSkills = () => {
    const payloadSkills = skills.map(({ skillId, level }) => ({
      skillId,
      level: level as any,
    }));

    syncSkillsMutation.mutate(
      { skills: payloadSkills },
      {
        onSuccess: () => toast.success("Skills synchronized successfully!"),
        onError: (err) => toast.error(err.message || "Failed to sync skills"),
      },
    );
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      {/* Profile Header & Avatar Upload */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={userProfile?.imageUrl || ""}
                alt={userProfile?.name || "User"}
              />
              <AvatarFallback className="text-xl font-bold">
                {userProfile?.name?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Upload className="h-6 w-6 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploadImageMutation.isPending}
            />
          </div>

          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {userProfile?.name || "User Profile"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {userProfile?.email}
            </p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
              {userProfile?.role}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="socials">Social Links</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Update your basic profile information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="socials">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your connected social accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socials.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <Select
                    value={item.platform}
                    onValueChange={(val) => {
                      setSocials((prev) =>
                        prev.map((s) =>
                          s.id === item.id
                            ? { ...s, platform: val as SocialPlatform }
                            : s,
                        ),
                      );
                    }}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "GITHUB",
                        "LINKEDIN",
                        "TWITTER",
                        "FACEBOOK",
                        "WEBSITE",
                      ].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      setSocials((prev) =>
                        prev.map((s) =>
                          s.id === item.id ? { ...s, url: newUrl } : s,
                        ),
                      );
                    }}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      setSocials((prev) => prev.filter((s) => s.id !== item.id))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setSocials((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        platform: "GITHUB" as SocialPlatform,
                        url: "",
                      },
                    ])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Social
                </Button>

                <Button
                  onClick={handleSyncSocials}
                  disabled={syncSocialsMutation.isPending}
                >
                  {syncSocialsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Socials
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" /> Skill Matrix
              </CardTitle>
              <CardDescription>
                Add your technical skills and proficiency levels to showcase on
                your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-2">
                  No skills added yet. Click "Add Skill" below to get started.
                </p>
              ) : (
                skills.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 items-center"
                  >
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="e.g. React, Node.js, TypeScript"
                        value={item.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSkills((prev) =>
                            prev.map((sk) =>
                              sk.id === item.id ? { ...sk, name: val } : sk,
                            ),
                          );
                        }}
                      />
                    </div>

                    <div className="w-full sm:w-45">
                      <Select
                        value={item.level}
                        onValueChange={(val) => {
                          setSkills((prev) =>
                            prev.map((sk) =>
                              sk.id === item.id ? { ...sk, level: val } : sk,
                            ),
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                          <SelectItem value="INTERMEDIATE">
                            INTERMEDIATE
                          </SelectItem>
                          <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                          <SelectItem value="EXPERT">EXPERT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="self-end sm:self-auto"
                      onClick={() =>
                        setSkills((prev) =>
                          prev.filter((sk) => sk.id !== item.id),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newUuid = crypto.randomUUID();
                    setSkills((prev) => [
                      ...prev,
                      {
                        id: newUuid,
                        skillId: newUuid,
                        name: "",
                        level: "INTERMEDIATE",
                      },
                    ]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Skill
                </Button>

                <Button
                  onClick={handleSyncSkills}
                  disabled={syncSkillsMutation.isPending}
                >
                  {syncSkillsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" /> Save Skills
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
