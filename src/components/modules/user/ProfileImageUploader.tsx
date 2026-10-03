"use client";

import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useState } from "react";
import { useUploadProfileImage } from "@/hooks/user.hook";

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  name?: string | null;
  editable?: boolean;
}

export function ProfileImageUploader({
  currentImageUrl,
  name,
  editable = true,
}: ProfileImageUploaderProps) {
  const { mutate: uploadImage, isPending } = useUploadProfileImage();
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be under 5MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    uploadImage(file, {
      onError: (error) => {
        setPreview(null);
        setErrorMessage(error.message || "Failed to upload profile image.");
      },
    });
  };

  const displayImage = preview || currentImageUrl;
  const initials = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-background bg-muted flex items-center justify-center shadow-lg">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name || "User Avatar"}
            fill
            sizes="112px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-3xl font-bold text-muted-foreground">
            {initials}
          </span>
        )}

        {editable && (
          <label
            htmlFor="profile-image-input"
            className="absolute inset-0 z-10 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Upload profile image"
          >
            {isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">Change</span>
              </>
            )}
          </label>
        )}

        {editable && (
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />
        )}
      </div>

      {errorMessage && (
        <p className="text-xs text-destructive text-center font-medium max-w-50">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
