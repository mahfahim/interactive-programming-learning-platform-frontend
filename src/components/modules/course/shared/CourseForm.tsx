"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ICourse, ICreateCourseInput, IUpdateCourseInput } from "@/types";
import { CourseLevel, Language } from "@/types/enum.type";

interface CourseFormProps {
  initialData?: ICourse;
  isSubmitting?: boolean;
  onSubmit: (data: ICreateCourseInput | IUpdateCourseInput) => void;
  onCancel?: () => void;
}

interface DynamicItem {
  id: string;
  text: string;
}

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 9);

export function CourseForm({
  initialData,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl || "",
  );
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : "0",
  );

  const [shortDescription, setShortDescription] = useState(
    initialData?.description?.shortDescription || "",
  );
  const [fullDescription, setFullDescription] = useState(
    initialData?.description?.fullDescription || "",
  );
  const [level, setLevel] = useState<CourseLevel>(
    initialData?.description?.level || CourseLevel.BEGINNER,
  );
  const [language, setLanguage] = useState<Language>(
    initialData?.description?.language || Language.ENGLISH,
  );

  const [outcomes, setOutcomes] = useState<DynamicItem[]>(() => {
    const initialOutcomes = initialData?.description?.learningOutcomes;
    if (initialOutcomes && initialOutcomes.length > 0) {
      return initialOutcomes.map((o, idx) => ({
        id: (o as { id?: string }).id || `outcome-${idx}`,
        text: o.outcomeText,
      }));
    }
    return [{ id: generateId(), text: "" }];
  });

  const [prerequisites, setPrerequisites] = useState<DynamicItem[]>(() => {
    const initialPrereqs = initialData?.description?.prerequisites;
    if (initialPrereqs && initialPrereqs.length > 0) {
      return initialPrereqs.map((p, idx) => ({
        id: (p as { id?: string }).id || `prereq-${idx}`,
        text: p.prerequisiteText,
      }));
    }
    return [{ id: generateId(), text: "" }];
  });

  // Re-sync dynamic props if initialData updates
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setCoverImageUrl(initialData.coverImageUrl || "");
      setPrice(
        initialData.price !== undefined ? String(initialData.price) : "0",
      );
      setShortDescription(initialData.description?.shortDescription || "");
      setFullDescription(initialData.description?.fullDescription || "");
      if (initialData.description?.level)
        setLevel(initialData.description.level);
      if (initialData.description?.language)
        setLanguage(initialData.description.language);

      if (initialData.description?.learningOutcomes?.length) {
        setOutcomes(
          initialData.description.learningOutcomes.map((o, idx) => ({
            id: (o as { id?: string }).id || `outcome-${idx}`,
            text: o.outcomeText,
          })),
        );
      }

      if (initialData.description?.prerequisites?.length) {
        setPrerequisites(
          initialData.description.prerequisites.map((p, idx) => ({
            id: (p as { id?: string }).id || `prereq-${idx}`,
            text: p.prerequisiteText,
          })),
        );
      }
    }
  }, [initialData]);

  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleAddOutcome = () =>
    setOutcomes([...outcomes, { id: generateId(), text: "" }]);

  const handleRemoveOutcome = (id: string) =>
    setOutcomes(outcomes.filter((item) => item.id !== id));

  const handleOutcomeChange = (id: string, text: string) => {
    setOutcomes(
      outcomes.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const handleAddPrerequisite = () =>
    setPrerequisites([...prerequisites, { id: generateId(), text: "" }]);

  const handleRemovePrerequisite = (id: string) =>
    setPrerequisites(prerequisites.filter((item) => item.id !== id));

  const handlePrerequisiteChange = (id: string, text: string) => {
    setPrerequisites(
      prerequisites.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedOutcomes = outcomes
      .filter((item) => item.text.trim() !== "")
      .map((item, idx) => ({ outcomeText: item.text, displayOrder: idx + 1 }));

    const formattedPrereqs = prerequisites
      .filter((item) => item.text.trim() !== "")
      .map((item, idx) => ({
        prerequisiteText: item.text,
        displayOrder: idx + 1,
      }));

    const payload = {
      title,
      slug,
      coverImageUrl: coverImageUrl || undefined,
      price: Number(price) || 0,
      description: {
        shortDescription,
        fullDescription,
        level,
        language,
        learningOutcomes: formattedOutcomes,
        prerequisites: formattedPrereqs,
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="course-title" className="text-sm font-medium">
                Course Title *
              </label>
              <Input
                id="course-title"
                required
                placeholder="e.g. Mastering Modern C++"
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="course-slug" className="text-sm font-medium">
                Slug *
              </label>
              <Input
                id="course-slug"
                required
                placeholder="e.g. mastering-modern-cpp"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cover-image-url" className="text-sm font-medium">
                Cover Image URL
              </label>
              <Input
                id="cover-image-url"
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="course-price" className="text-sm font-medium">
                Price (USD) *
              </label>
              <Input
                id="course-price"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description & Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Course Description & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="course-level" className="text-sm font-medium">
                Difficulty Level *
              </label>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as CourseLevel)}
              >
                <SelectTrigger id="course-level">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CourseLevel.BEGINNER}>Beginner</SelectItem>
                  <SelectItem value={CourseLevel.INTERMEDIATE}>
                    Intermediate
                  </SelectItem>
                  <SelectItem value={CourseLevel.ADVANCED}>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="course-language" className="text-sm font-medium">
                Language *
              </label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as Language)}
              >
                <SelectTrigger id="course-language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Language.ENGLISH}>English</SelectItem>
                  <SelectItem value={Language.BENGALI}>Bengali</SelectItem>
                  <SelectItem value={Language.SPANISH}>Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="short-description" className="text-sm font-medium">
              Short Description *
            </label>
            <Textarea
              id="short-description"
              required
              rows={2}
              placeholder="Brief summary of the course (max 250 characters)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="full-description" className="text-sm font-medium">
              Full Description *
            </label>
            <Textarea
              id="full-description"
              required
              rows={5}
              placeholder="Comprehensive details about the course content and goals"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Learning Outcomes</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOutcome}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add Outcome
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {outcomes.map((outcome, idx) => (
            <div key={outcome.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6 text-right font-medium">
                {idx + 1}.
              </span>
              <Input
                aria-label={`Learning Outcome ${idx + 1}`}
                required
                placeholder="What will students learn?"
                value={outcome.text}
                onChange={(e) =>
                  handleOutcomeChange(outcome.id, e.target.value)
                }
              />
              {outcomes.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOutcome(outcome.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Prerequisites</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPrerequisite}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add Prerequisite
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {prerequisites.map((prereq, idx) => (
            <div key={prereq.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6 text-right font-medium">
                {idx + 1}.
              </span>
              <Input
                aria-label={`Prerequisite ${idx + 1}`}
                required
                placeholder="What should students know before starting?"
                value={prereq.text}
                onChange={(e) =>
                  handlePrerequisiteChange(prereq.id, e.target.value)
                }
              />
              {prerequisites.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePrerequisite(prereq.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-32 font-bold"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Course"
              : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
