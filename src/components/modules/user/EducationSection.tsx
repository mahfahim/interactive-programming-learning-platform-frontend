"use client";

import { Calendar, GraduationCap, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSyncMyEducations } from "@/hooks/user.hook";
import type { ISyncEducationItem, UserEducation } from "@/types";
import { formatDate } from "@/utils/date.util";
import { UserValidation } from "@/validation/user.validation";
import { UserEmptyState } from "./UserEmptyState";

interface EducationSectionProps {
  educations?: UserEducation[];
  isEditable?: boolean;
}

interface EducationFormItem extends ISyncEducationItem {
  id: string;
}

export function EducationSection({
  educations = [],
  isEditable = false,
}: EducationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<EducationFormItem[]>(
    educations.map((e) => ({
      id: e.id || crypto.randomUUID(),
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      startDate: e.startDate
        ? new Date(e.startDate).toISOString().split("T")[0]
        : "",
      endDate: e.endDate
        ? new Date(e.endDate).toISOString().split("T")[0]
        : null,
    })),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: syncEducations, isPending } = useSyncMyEducations();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ISyncEducationItem,
    value: unknown,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage(null);

    const formattedPayload = {
      educations: items.map(({ id: _id, ...item }) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate).toISOString() : "",
        endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
      })),
    };

    const result =
      UserValidation.syncEducationsSchema.safeParse(formattedPayload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ||
          "Validation failed for education fields.",
      );
      return;
    }

    syncEducations(formattedPayload, {
      onSuccess: () => setIsEditing(false),
      onError: (err) =>
        setErrorMessage(err.message || "Failed to update education records."),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Education</CardTitle>
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
                  aria-label="Remove education item"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`institution-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Institution
                    </label>
                    <Input
                      id={`institution-${item.id}`}
                      placeholder="University or College"
                      value={item.institution}
                      onChange={(e) =>
                        handleChange(item.id, "institution", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`degree-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Degree
                    </label>
                    <Input
                      id={`degree-${item.id}`}
                      placeholder="Bachelor's, Master's, etc."
                      value={item.degree}
                      onChange={(e) =>
                        handleChange(item.id, "degree", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`fieldOfStudy-${item.id}`}
                      className="text-xs font-semibold"
                    >
                      Field of Study
                    </label>
                    <Input
                      id={`fieldOfStudy-${item.id}`}
                      placeholder="Computer Science, Engineering, etc."
                      value={item.fieldOfStudy}
                      onChange={(e) =>
                        handleChange(item.id, "fieldOfStudy", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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
                          handleChange(
                            item.id,
                            "endDate",
                            e.target.value || null,
                          )
                        }
                      />
                    </div>
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
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>
        ) : educations.length > 0 ? (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="border-l-2 border-primary/40 pl-4 py-1"
              >
                <h4 className="font-semibold text-base">
                  {edu.degree} - {edu.fieldOfStudy}
                </h4>
                <p className="text-sm text-muted-foreground font-medium">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(edu.startDate)} -{" "}
                    {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <UserEmptyState
            title="No education records"
            description="Add your academic degrees and background."
            icon={GraduationCap}
          />
        )}
      </CardContent>
    </Card>
  );
}
