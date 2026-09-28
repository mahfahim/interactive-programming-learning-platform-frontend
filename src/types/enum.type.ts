// src/types/enum.type.ts

export enum Role {
  ADMIN,
  INSTRUCTOR,
  STUDENT,
}

export enum UserStatus {
  ACTIVE,
  BLOCKED,
  DELETED,
}

export enum AuthProvider {
  GOOGLE,
  CREDENTIAL,
}

export enum SocialPlatform {
  GITHUB,
  LINKEDIN,
  TWITTER,
  FACEBOOK,
  YOUTUBE,
  INSTAGRAM,
  WEBSITE,
  OTHER,
}

export enum ProficiencyLevel {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
  EXPERT,
}

export enum CourseLevel {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
}

export enum LessonType {
  VIDEO,
  ARTICLE,
  QUIZ,
  CODING,
  ASSIGNMENT,
}

export enum Language {
  ENGLISH,
  BENGALI,
}

export enum ProgrammingLanguage {
  JAVASCRIPT,
  TYPESCRIPT,
  PYTHON,
  JAVA,
  CPP,
  C,
  GO,
  RUST,
  PHP,
  CSHARP,
}

export enum SubmissionStatus {
  PENDING,
  ACCEPTED,
  WRONG_ANSWER,
  TIME_LIMIT_EXCEEDED,
  MEMORY_LIMIT_EXCEEDED,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
}

export enum ReactionType {
  LIKE,
  DISLIKE,
  LOVE,
  HELPFUL,
  CELEBRATE,
  THINKING,
}

export enum PaymentStatus {
  UNPAID,
  COMPLETED,
  FAILED,
  CANCELLED,
  REFUNDED,
}

export enum AuditAction {
  // Auth
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  PASSWORD_CHANGED,

  // User Management
  ROLE_CHANGE,
  STATUS_CHANGE,
  USER_UPDATED,
  USER_SOFT_DELETED,

  // Course Management
  COURSE_CREATED,
  COURSE_UPDATED,
  COURSE_PUBLISHED,
  COURSE_DELETED,

  // Enrollment & Payment
  ENROLLMENT_CREATED,
  PAYMENT_COMPLETED,
  PAYMENT_FAILED,
  PAYMENT_REFUNDED,

  // Assessment & Certification
  ASSIGNMENT_SUBMITTED,
  ASSIGNMENT_GRADED,
  CERTIFICATE_ISSUED,
}
