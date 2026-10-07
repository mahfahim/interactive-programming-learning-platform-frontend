import { z } from "zod";
import { LessonType } from "@/types";

const articleDataSchema = z.object({
  content: z.string().optional(),
  sections: z
    .array(
      z.object({
        content: z.record(z.string(), z.unknown()).or(z.string()),
        displayOrder: z.number().int().nonnegative(),
      }),
    )
    .optional(),
});

const videoDataSchema = z.object({
  videoUrl: z.string().url("Invalid video URL format"),
  durationSeconds: z
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .optional(),
});

const quizOptionSchema = z.object({
  optionText: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean({ message: "isCorrect field is required" }),
  displayOrder: z
    .number()
    .int()
    .positive("Display order must be a positive integer"),
});

const quizQuestionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  displayOrder: z
    .number()
    .int()
    .positive("Display order must be a positive integer"),
  options: z
    .array(quizOptionSchema)
    .min(1, "Question must have at least one option"),
});

const quizDataSchema = z
  .object({
    questions: z
      .array(quizQuestionSchema)
      .min(1, "Quiz must contain at least one question"),
  })
  .refine(
    (data) =>
      data.questions?.every((q) =>
        q.options?.some((opt) => opt.isCorrect === true),
      ),
    {
      message: "Every question must have at least one correct option",
      path: ["questions"],
    },
  );

const assignmentDataSchema = z.object({
  title: z.string().optional(),
  instructions: z.string().min(1, "Instructions are required"),
  dueDate: z.string().datetime().or(z.date()).optional(),
});

const codingTestCaseSchema = z.object({
  inputData: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().optional().default(false),
  displayOrder: z.number().int().nonnegative(),
});

const codingDataSchema = z.object({
  problemStatement: z.string().min(1, "Problem statement is required"),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  timeLimitMs: z.number().int().positive().optional(),
  memoryLimitKb: z.number().int().positive().optional(),
  testCases: z.array(codingTestCaseSchema).optional(),
});

export const createLessonSchema = z
  .object({
    title: z.string({ message: "Title is required" }).trim().min(1).max(255),
    moduleId: z.string({ message: "Module ID is required" }).min(1),
    type: z.nativeEnum(LessonType, { message: "Invalid lesson type" }),
    displayOrder: z
      .number({ message: "Display order is required" })
      .int()
      .nonnegative(),
    isPro: z.boolean().optional(),
    isFree: z.boolean().optional(),

    articleData: articleDataSchema.optional(),
    videoData: videoDataSchema.optional(),
    quizData: quizDataSchema.optional(),
    assignmentData: assignmentDataSchema.optional(),
    codingData: codingDataSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === LessonType.ARTICLE && !data.articleData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Article data is required for ARTICLE lesson type",
        path: ["articleData"],
      });
    }
    if (data.type === LessonType.VIDEO && !data.videoData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video data is required for VIDEO lesson type",
        path: ["videoData"],
      });
    }
    if (data.type === LessonType.QUIZ && !data.quizData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quiz data is required for QUIZ lesson type",
        path: ["quizData"],
      });
    }
    if (data.type === LessonType.ASSIGNMENT && !data.assignmentData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assignment data is required for ASSIGNMENT lesson type",
        path: ["assignmentData"],
      });
    }
    if (data.type === LessonType.CODING && !data.codingData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Coding data is required for CODING lesson type",
        path: ["codingData"],
      });
    }
  });

export const updateLessonSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  moduleId: z.string().min(1).optional(), // 🟢 ADDED: Module Shift করার জন্য
  displayOrder: z.number().int().nonnegative().optional(),
  isPro: z.boolean().optional(),
  isFree: z.boolean().optional(),

  articleData: z
    .object({
      content: z.string().optional(),
    })
    .optional(),

  videoData: z
    .object({
      videoUrl: z.string().url("Invalid video URL format").optional(), // 🟢 FIXED: optional() পুনঃস্থাপিত
      durationSeconds: z.number().int().positive().optional(),
    })
    .optional(),

  quizData: quizDataSchema.optional(),

  assignmentData: z
    .object({
      title: z.string().optional(),
      instructions: z.string().optional(),
      dueDate: z.string().datetime().or(z.date()).optional(),
    })
    .optional(),

  codingData: z
    .object({
      problemStatement: z.string().optional(),
      inputFormat: z.string().optional(),
      outputFormat: z.string().optional(),
      timeLimitMs: z.number().int().positive().optional(),
      memoryLimitKb: z.number().int().positive().optional(),
    })
    .optional(),
});

export const updateLessonProgressSchema = z.object({
  isCompleted: z.boolean({ message: "isCompleted field is required" }),
});

export const LessonValidations = {
  createLessonSchema,
  updateLessonSchema,
  updateLessonProgressSchema,
};
