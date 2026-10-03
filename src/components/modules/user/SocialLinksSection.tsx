"use client";

import {
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSyncMySocials } from "@/hooks/user.hook";
import { type ISyncSocialItem, SocialPlatform, type UserSocial } from "@/types";
import { UserValidation } from "@/validation/user.validation";
import { UserEmptyState } from "./UserEmptyState";

interface SocialLinksSectionProps {
  socials?: UserSocial[];
  isEditable?: boolean;
}

interface SocialFormItem extends ISyncSocialItem {
  id: string;
}

export function SocialLinksSection({
  socials = [],
  isEditable = false,
}: SocialLinksSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<SocialFormItem[]>(
    socials.map((s) => ({
      id: s.id || crypto.randomUUID(),
      platform: s.platform,
      url: s.url,
    })),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: syncSocials, isPending } = useSyncMySocials();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), platform: SocialPlatform.GITHUB, url: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ISyncSocialItem,
    value: unknown,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage(null);
    const payload = {
      socials: items.map(({ id: _id, ...item }) => item),
    };

    const result = UserValidation.syncSocialsSchema.safeParse(payload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message || "Validation failed for social URLs.",
      );
      return;
    }

    syncSocials(payload, {
      onSuccess: () => setIsEditing(false),
      onError: (err) =>
        setErrorMessage(err.message || "Failed to update social profiles."),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Social Profiles</CardTitle>
        </div>
        {isEditable &&
          (!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}{" "}
                Save
              </Button>
            </div>
          ))}
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 text-sm rounded bg-destructive/10 text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 border rounded-md bg-muted/20"
              >
                <select
                  value={item.platform}
                  onChange={(e) =>
                    handleChange(
                      item.id,
                      "platform",
                      e.target.value as SocialPlatform,
                    )
                  }
                  aria-label="Social Platform"
                  className="p-2 border rounded-md text-sm bg-background"
                >
                  {Object.values(SocialPlatform).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="https://github.com/username"
                  value={item.url}
                  onChange={(e) => handleChange(item.id, "url", e.target.value)}
                  aria-label="Social Profile URL"
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove social profile"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" /> Add Social Link
            </Button>
          </div>
        ) : socials.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{s.platform}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        ) : (
          <UserEmptyState
            title="No social links"
            description="Connect your GitHub, LinkedIn, or Twitter profiles."
            icon={Share2}
          />
        )}
      </CardContent>
    </Card>
  );
}
