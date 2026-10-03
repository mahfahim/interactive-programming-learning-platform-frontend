"use client";

import { ExternalLink, Link2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSyncMyWebsites } from "@/hooks/user.hook";
import type { ISyncWebsiteItem, UserWebsite } from "@/types";
import { UserValidation } from "@/validation/user.validation";
import { UserEmptyState } from "./UserEmptyState";

interface WebsitesSectionProps {
  websites?: UserWebsite[];
  isEditable?: boolean;
}

interface WebsiteFormItem extends ISyncWebsiteItem {
  id: string;
}

export function WebsitesSection({
  websites = [],
  isEditable = false,
}: WebsitesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<WebsiteFormItem[]>(
    websites.map((w) => ({
      id: w.id || crypto.randomUUID(),
      title: w.title,
      url: w.url,
    })),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: syncWebsites, isPending } = useSyncMyWebsites();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", url: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ISyncWebsiteItem,
    value: unknown,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage(null);
    const payload = {
      websites: items.map(({ id: _id, ...item }) => item),
    };

    const result = UserValidation.syncWebsitesSchema.safeParse(payload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ||
          "Validation failed for personal websites.",
      );
      return;
    }

    syncWebsites(payload, {
      onSuccess: () => setIsEditing(false),
      onError: (err) =>
        setErrorMessage(err.message || "Failed to update websites."),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Link2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Personal Websites</CardTitle>
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
                <Input
                  placeholder="Title (e.g. Portfolio)"
                  value={item.title}
                  onChange={(e) =>
                    handleChange(item.id, "title", e.target.value)
                  }
                  aria-label="Website Title"
                  className="w-1/3 text-sm"
                />
                <Input
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => handleChange(item.id, "url", e.target.value)}
                  aria-label="Website URL"
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove website"
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
              <Plus className="w-4 h-4" /> Add Website
            </Button>
          </div>
        ) : websites.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {websites.map((w) => (
              <a
                key={w.id}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm">{w.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-55">
                    {w.url}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        ) : (
          <UserEmptyState
            title="No websites listed"
            description="Add links to your portfolio, blog, or project showcases."
            icon={Link2}
          />
        )}
      </CardContent>
    </Card>
  );
}
