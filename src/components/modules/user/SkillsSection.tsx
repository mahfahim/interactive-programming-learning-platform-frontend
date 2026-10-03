"use client";

import { Code2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSyncMySkills } from "@/hooks/user.hook";
import {
  type ISyncSkillItem,
  type IUserSkillWithDetail,
  ProficiencyLevel,
} from "@/types";
import { UserValidation } from "@/validation/user.validation";
import { UserEmptyState } from "./UserEmptyState";

interface SkillsSectionProps {
  skills?: IUserSkillWithDetail[];
  isEditable?: boolean;
}

interface SkillFormItem extends ISyncSkillItem {
  id: string;
}

export function SkillsSection({
  skills = [],
  isEditable = false,
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<SkillFormItem[]>(
    skills.map((s) => ({
      id: s.skillId || crypto.randomUUID(),
      skillId: s.skillId,
      proficiencyLevel: s.proficiencyLevel,
    })),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: syncSkills, isPending } = useSyncMySkills();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        skillId: "",
        proficiencyLevel: ProficiencyLevel.BEGINNER,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ISyncSkillItem,
    value: unknown,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage(null);
    const payload = {
      skills: items.map(({ id: _id, ...item }) => item),
    };

    const result = UserValidation.syncSkillsSchema.safeParse(payload);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ||
          "Validation failed for skills matrix.",
      );
      return;
    }

    syncSkills(payload, {
      onSuccess: () => setIsEditing(false),
      onError: (err) =>
        setErrorMessage(err.message || "Failed to update skills matrix."),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Skills & Expertise</CardTitle>
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
                  placeholder="Skill ID (UUID)"
                  value={item.skillId}
                  onChange={(e) =>
                    handleChange(item.id, "skillId", e.target.value)
                  }
                  aria-label="Skill ID"
                  className="flex-1 text-sm"
                />
                <select
                  value={item.proficiencyLevel || ProficiencyLevel.BEGINNER}
                  onChange={(e) =>
                    handleChange(
                      item.id,
                      "proficiencyLevel",
                      e.target.value as ProficiencyLevel,
                    )
                  }
                  aria-label="Proficiency Level"
                  className="p-2 border rounded-md text-sm bg-background"
                >
                  {Object.values(ProficiencyLevel).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove skill"
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
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </div>
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge
                key={s.skillId}
                variant="secondary"
                className="px-3 py-1.5 text-sm gap-1.5 font-medium"
              >
                <span>{s.skill?.name || "Technical Skill"}</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  ({s.proficiencyLevel})
                </span>
              </Badge>
            ))}
          </div>
        ) : (
          <UserEmptyState
            title="No skills added"
            description="Showcase your tech stack and proficiency level."
            icon={Code2}
          />
        )}
      </CardContent>
    </Card>
  );
}
