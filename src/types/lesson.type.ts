import type { LessonType } from "./enum.type";

export interface IArticleSectionInput {
  content: Record<string, unknown> | string;
  displayOrder: number;
}

export interface IArticleDataInput {
  content?: string;
  sections?: IArticleSectionInput[];
}

export interface IArticleUpdateInput {
  content?: string;
}

export interface IVideoDataInput {
  videoUrl: string;
  durationSeconds?: number;
}

export interface IQuizOptionInput {
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface IQuizQuestionInput {
  questionText: string;
  displayOrder: number;
  options: IQuizOptionInput[];
}

export interface IQuizDataInput {
  questions: IQuizQuestionInput[];
}

export interface IAssignmentDataInput {
  title?: string;
  instructions: string;
  dueDate?: Date | string;
}

export interface IAssignmentUpdateInput {
  title?: string;
  instructions?: string;
  dueDate?: Date | string;
}

export interface ICodingTestCaseInput {
  inputData: string;
  expectedOutput: string;
  isHidden?: boolean;
  displayOrder: number;
}

export interface ICodingDataInput {
  problemStatement: string;
  inputFormat?: string;
  outputFormat?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  testCases?: ICodingTestCaseInput[];
}

export interface ICodingUpdateInput {
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
}

export interface ICreateLessonInput {
  title: string;
  moduleId: string;
  type: LessonType;
  displayOrder: number;
  isPro?: boolean;
  isFree?: boolean;

  articleData?: IArticleDataInput;
  videoData?: IVideoDataInput;
  quizData?: IQuizDataInput;
  assignmentData?: IAssignmentDataInput;
  codingData?: ICodingDataInput;
}

export interface IUpdateLessonInput {
  title?: string;
  moduleId?: string;
  displayOrder?: number;
  isPro?: boolean;
  isFree?: boolean;

  articleData?: IArticleUpdateInput;
  videoData?: Partial<IVideoDataInput>;
  quizData?: IQuizDataInput;
  assignmentData?: IAssignmentUpdateInput;
  codingData?: ICodingUpdateInput;
}

export interface IUpdateLessonProgressInput {
  isCompleted: boolean;
}

export interface TLessonResponse {
  id: string;
  title: string;
  moduleId: string;
  lessonType: LessonType;
  displayOrder: number;
  isPro: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  nextLessonId?: string | null;
  createdAt: string;
  updatedAt: string;
  module?: {
    id: string;
    title: string;
    superModuleId: string | null;
    superModule?: {
      id: string;
      title: string;
      courseId: string;
      course?: {
        id: string;
        title: string;
        price: number | string;
      } | null;
    } | null;
  } | null;
  article?: Record<string, unknown> | null;
  video?: Record<string, unknown> | null;
  quiz?: Record<string, unknown> | null;
  assignment?: Record<string, unknown> | null;
  coding?: Record<string, unknown> | null;
}
