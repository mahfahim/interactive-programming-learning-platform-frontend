// src/types/course.type.ts
import type { CourseLevel, Language } from "./enum.type";
import type { ISuperModule } from "./superModule.type";

export interface IPrerequisite extends ICreatePrerequisiteInput {
  id?: string;
  courseDescriptionId?: string;
}

export interface ILearningOutcome extends ICreateLearningOutcomeInput {
  id?: string;
  courseDescriptionId?: string;
}

export interface ICourseDescription {
  courseId?: string;
  shortDescription: string;
  fullDescription: string;
  level: CourseLevel;
  language: Language;
  learningOutcomes: ILearningOutcome[];
  prerequisites: IPrerequisite[];
}

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  coverImageUrl?: string | null;
  price: string | number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  instructorId?: string | null;
  description?: ICourseDescription | null;
  superModules?: ISuperModule[];
}

export interface ICreateLearningOutcomeInput {
  outcomeText: string;
  displayOrder: number;
}

export interface ICreatePrerequisiteInput {
  prerequisiteText: string;
  displayOrder: number;
}

export interface ICreateCourseDescriptionInput {
  shortDescription: string;
  fullDescription: string;
  level: CourseLevel;
  language: Language;
  learningOutcomes: ICreateLearningOutcomeInput[];
  prerequisites: ICreatePrerequisiteInput[];
}

export interface ICreateCourseInput {
  title: string;
  slug: string;
  coverImageUrl?: string;
  price?: number;
  description: ICreateCourseDescriptionInput;
}

export interface IUpdateCourseInput {
  title?: string;
  slug?: string;
  coverImageUrl?: string;
  price?: number;
  description?: {
    shortDescription?: string;
    fullDescription?: string;
    level?: CourseLevel;
    language?: Language;
    learningOutcomes?: ICreateLearningOutcomeInput[];
    prerequisites?: ICreatePrerequisiteInput[];
  };
}

export interface ICourseQueryParams {
  search?: string;
  level?: CourseLevel;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginatedMeta;
}
