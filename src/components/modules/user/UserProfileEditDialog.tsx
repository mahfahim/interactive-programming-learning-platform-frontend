"use client";

import { Edit3, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMyProfile } from "@/hooks/user.hook";
import type { IUpdateUserProfileDto, IUserProfileResponse } from "@/types";
import { UserValidation } from "@/validation/user.validation";

interface UserProfileEditDialogProps {
  profile: IUserProfileResponse;
}

export function UserProfileEditDialog({ profile }: UserProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.description?.bio || "");
  const [cityId, setCityId] = useState(profile.description?.cityId || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload: IUpdateUserProfileDto = {
      name: name.trim() || null,
      bio: bio.trim() || null,
      cityId: cityId.trim() || null,
    };

    const result = UserValidation.updateProfileSchema.safeParse(payload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message || "Invalid input values.",
      );
      return;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (error) => {
        setErrorMessage(error.message || "Failed to update profile details.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive font-medium">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief professional summary..."
              rows={4}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-city" className="text-sm font-medium">
              City ID (Optional)
            </label>
            <Input
              id="edit-city"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              placeholder="UUID format if selecting a city"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
