"use client";

import { Briefcase, Calendar, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSyncMyExperiences } from "@/hooks/user.hook";
import type { ISyncExperienceItem, UserExperience } from "@/types";
import { formatDate } from "@/utils/date.util";
import { UserValidation } from "@/validation/user.validation";
import { UserEmptyState } from "./UserEmptyState";

interface ExperienceSectionProps {
  experiences?: UserExperience[];
  isEditable?: boolean;
}

interface ExperienceFormItem extends ISyncExperienceItem {
  id: string;
}

export function ExperienceSection({
  experiences = [],
  isEditable = false,
}: ExperienceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<ExperienceFormItem[]>(
    experiences.map((exp) => ({
      id: exp.id || crypto.randomUUID(),
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().split("T")[0]
        : "",
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : null,
      description: exp.description || null,
    })),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: syncExperiences, isPending } = useSyncMyExperiences();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        description: "",
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ISyncExperienceItem,
    value: unknown,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage(null);

    const formattedPayload = {
      experiences: items.map(({ id: _id, ...item }) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate).toISOString() : "",
        endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
      })),
    };

    const result =
      UserValidation.syncExperiencesSchema.safeParse(formattedPayload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ||
          "Validation failed for work experience.",
      );
      return;
    }

    syncExperiences(formattedPayload, {
      onSuccess: () => setIsEditing(false),
      onError: (err) =>
        setErrorMessage(err.message || "Failed to update experience records."),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Work Experience</CardTitle>
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
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg space-y-3 relative bg-muted/20"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove work experience item"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`company-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Company
                    </label>
                    <Input
                      id={`company-${item.id}`}
                      placeholder="Company Name"
                      value={item.company}
                      onChange={(e) =>
                        handleChange(item.id, "company", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`position-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Position
                    </label>
                    <Input
                      id={`position-${item.id}`}
                      placeholder="Job Title"
                      value={item.position}
                      onChange={(e) =>
                        handleChange(item.id, "position", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`startDate-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Start Date
                    </label>
                    <Input
                      id={`startDate-${item.id}`}
                      type="date"
                      value={item.startDate ? String(item.startDate) : ""}
                      onChange={(e) =>
                        handleChange(item.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`endDate-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      End Date
                    </label>
                    <Input
                      id={`endDate-${item.id}`}
                      type="date"
                      value={item.endDate ? String(item.endDate) : ""}
                      onChange={(e) =>
                        handleChange(item.id, "endDate", e.target.value || null)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`description-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Description
                    </label>
                    <Textarea
                      id={`description-${item.id}`}
                      placeholder="Key achievements and technologies used..."
                      value={item.description || ""}
                      onChange={(e) =>
                        handleChange(item.id, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </div>
        ) : experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="border-l-2 border-primary/40 pl-4 py-1"
              >
                <h4 className="font-semibold text-base">{exp.position}</h4>
                <p className="text-sm text-muted-foreground font-medium">
                  {exp.company}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm mt-2 text-foreground/90 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <UserEmptyState
            title="No work experience"
            description="Add your software engineering or industry work history."
            icon={Briefcase}
          />
        )}
      </CardContent>
    </Card>
  );
}
