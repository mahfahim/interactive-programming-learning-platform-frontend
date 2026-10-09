# CODE BD CODE — Interactive Programming Learning Platform (Frontend)

A modern, responsive programming-learning platform where students can explore courses, learn through structured lessons, practice coding, complete quizzes and assignments, track progress, and manage certificates. Instructors can manage course content and learning activities, while administrators manage users, payments, analytics, and platform activity.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Architecture and Request Flow](#data-architecture-and-request-flow-pattern)
- [Route-to-API Mapping](#route-to-api-end-to-end-mapping)
- [State Management, Validation, and Authentication](#state-management-validation-and-authentication)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Backend Integration](#backend-integration)
- [UI and Styling](#ui-and-styling)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

CODE BD CODE is an interactive programming-learning platform built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. The frontend communicates with a backend API through a shared API client and organizes application code by routes, feature components, custom hooks, API services, types, validation schemas, and state stores.

The course content follows this hierarchy:

**Course → Super Module → Module → Lesson**

Lessons can support different learning formats, including video, article, quiz, coding problem, and assignment.

- **Frontend repository:** https://github.com/mahfahim/interactive-programming-learning-platform-frontend
- **Backend repository:** https://github.com/mahfahim/interactive-programming-learning-platform-backend
- **API documentation:** https://documenter.getpostman.com/view/52004920/2sBYB1MTLY
- **Backend deployment:** https://code-bd-code-backend.vercel.app/

## Features

### Authentication and Account Management
- Login and registration
- Email verification
- Forgot-password and reset-password flows
- Authentication-aware application routes
- Profile management

### Courses and Learning Content
- Browse public courses and view course details
- Manage courses and course structures
- Organize content into super modules, modules, and lessons
- Support video and article lessons, quizzes, coding problems, and assignments
- Enroll in courses and access enrolled learning content
- Track lesson and course progress

### Interactive Learning
- Submit code to coding problems
- Take quizzes and submit assignments
- Participate in lesson discussions
- View learning progress and certificates

### Payments and Certificates
- Initiate and verify payments
- View student payment history
- Allow administrators to review payments and process refunds
- View certificates and verify certificates using a certificate UID

### Administration and Instructor Tools
- Admin analytics dashboard
- User management and role updates
- Audit-log viewing
- Course and learning-content management
- Instructor course-building and learning-activity management

### User Experience
- Responsive layouts
- Reusable UI components
- Form validation
- Loading, empty, and error states for feature workflows
- Toast notifications and query-driven server-state management

## User Roles

| Role           | Main responsibilities                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student**    | Browse courses, enroll, study lessons, submit coding work/quizzes/assignments, join discussions, view payments, track progress, and access certificates. |
| **Instructor** | Create and manage courses and learning content, including quizzes, coding problems, assignments, and grading workflows.                                  |
| **Admin**      | Manage users and roles, oversee courses and payments, review analytics, process refunds, and inspect audit logs.                                         |

The exact permissions available to each role are enforced by the backend and reflected in the frontend experience.

## Technology Stack

| Technology                      | Purpose                                               |
| ------------------------------- | ----------------------------------------------------- |
| Next.js 16                      | App Router and frontend application framework         |
| React 19                        | Component-based UI                                    |
| TypeScript                      | Static typing                                         |
| Tailwind CSS 4                  | Utility-first styling                                 |
| shadcn/ui and Radix UI          | Accessible, reusable UI primitives                    |
| Lucide React                    | Icons                                                 |
| TanStack React Query            | Server state, caching, mutations, and query lifecycle |
| TanStack Form / React Hook Form | Form state and submission workflows where used        |
| Zod                             | Input and payload validation                          |
| Zustand                         | Shared client-side state                              |
| ofetch                          | HTTP request utility used by the project API client   |
| next-themes                     | Theme handling                                        |
| react-markdown                  | Markdown content rendering                            |
| react-player                    | Media playback                                        |
| Recharts                        | Charts and analytics visualizations                   |
| date-fns                        | Date formatting and utilities                         |
| Sonner                          | Toast notifications                                   |
| Biome                           | Linting and formatting                                |

> Check `package.json` for the exact versions installed in the current branch.

## Project Structure

```text
src/
├── api/                         # API service functions
│   ├── analytics.api.ts
│   ├── assignment.api.ts
│   ├── auditLog.api.ts
│   ├── auth.api.ts
│   ├── certificate.api.ts
│   ├── course.api.ts
│   ├── discussion.api.ts
│   ├── enrollment.api.ts
│   ├── judge.api.ts
│   ├── lesson.api.ts
│   ├── module.api.ts
│   ├── payment.api.ts
│   ├── quiz.api.ts
│   ├── superModule.api.ts
│   └── user.api.ts
├── app/                         # Next.js App Router routes
│   ├── (auth)/                  # Login, registration, password flows
│   ├── (dashboard)/
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── instructor/          # Instructor dashboard pages
│   │   ├── student/             # Student dashboard pages
│   │   └── profile/             # Profile pages
│   ├── (public)/                # Public-facing pages
│   ├── payment/callback/        # Payment callback
│   └── verify/[certificateUid]/ # Public certificate verification
├── components/
│   ├── modules/                 # Feature-specific components
│   │   ├── analytics/
│   │   ├── assignment/
│   │   ├── auditLog/
│   │   ├── auth/
│   │   ├── certificate/
│   │   ├── course/
│   │   ├── discussion/
│   │   ├── enrollment/
│   │   ├── lesson/
│   │   ├── module/
│   │   ├── payment/
│   │   ├── superModule/
│   │   └── user/
│   ├── shared/                  # Shared application components
│   └── ui/                      # Reusable UI primitives
├── hooks/                       # Custom hooks, including React Query hooks
├── lib/
│   └── apiClient.ts             # Shared HTTP/API client
├── providers/                   # Auth, query, and theme providers
├── routes/                      # Route constants/helpers
├── stores/                      # Zustand stores
├── types/                       # Shared TypeScript types
├── utils/                       # Utility functions
└── validation/                  # Zod validation schemas
```

Some filenames or route segments may differ as the project evolves. Refer to the current `src/` tree for the exact implementation.

## Data Architecture & Request Flow Pattern

Features are organized around a consistent **unidirectional request/data flow**:

```text
[ App Router Route ] (src/app/...)
        |
        v
[ Feature Component ] (src/components/modules/...)
        |
        v
[ Custom Hook (React Query) ] (src/hooks/*.hook.ts)
        |
        v
[ API Service Layer ] (src/api/*.api.ts)
        |
        v
[ Shared API Client ] (src/lib/apiClient.ts)
        |
        v
[ Backend API ]
```

### Layer responsibilities

1. **App Router Route (`src/app/`)** — defines the page URL and composes the page-level UI.
2. **Feature Component (`src/components/modules/`)** — renders feature UI and coordinates user interactions.
3. **Custom Hook (`src/hooks/`)** — manages server-state queries and mutations, loading/error states, and cache updates using React Query.
4. **API Service (`src/api/`)** — encapsulates endpoint-specific requests and payloads.
5. **Shared API Client (`src/lib/apiClient.ts`)** — centralizes HTTP request configuration and shared request behavior.
6. **Backend API** — performs server-side business logic, authorization, persistence, and validation.

This separation keeps route components, UI, server state, and endpoint details from becoming tightly coupled.

## Route-to-API End-to-End Mapping

The tables below document the intended feature-level mapping. Component and hook names are illustrative of the architecture and should be checked against the current source tree before being treated as exact exported identifiers.

### 1. Authentication & Security

| App route                 | Feature component        | React Query hook    | API service   | Purpose                                    |
| ------------------------- | ------------------------ | ------------------- | ------------- | ------------------------------------------ |
| `/(auth)/login`           | `LoginForm.tsx`          | `useLogin`          | `auth.api.ts` | User login and authentication state update |
| `/(auth)/register`        | `RegisterForm.tsx`       | `useRegister`       | `auth.api.ts` | Student/user registration                  |
| `/(auth)/forgot-password` | `ForgotPasswordForm.tsx` | `useForgotPassword` | `auth.api.ts` | Request a password-reset email             |
| `/(auth)/reset-password`  | `ResetPasswordForm.tsx`  | `useResetPassword`  | `auth.api.ts` | Set a new password using a reset token     |
| `/(auth)/verify-email`    | `VerifyEmailForm.tsx`    | `useVerifyEmail`    | `auth.api.ts` | Email-verification flow                    |

### 2. Course & Content Hierarchy Management

The content hierarchy is **Course → Super Module → Module → Lesson**.

| App route                                                                          | Feature component                                      | Custom hook                                    | API service          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- | -------------------- |
| `/(dashboard)/admin/courses` and `/(dashboard)/instructor/courses`                 | `CourseManagement.tsx`, `CourseManagementTable.tsx`    | `useGetAllCourses`, `useDeleteCourse`          | `course.api.ts`      |
| `.../courses/create` and `.../courses/[courseId]/edit`                             | `CreateCourse.tsx`, `EditCourse.tsx`, `CourseForm.tsx` | `useCreateCourse`, `useUpdateCourse`           | `course.api.ts`      |
| `.../[courseId]/super-modules/create` and `.../super-modules/[superModuleId]/edit` | `SuperModuleCreateDialog.tsx`, `EditSuperModule.tsx`   | `useCreateSuperModule`, `useUpdateSuperModule` | `superModule.api.ts` |
| `.../[superModuleId]/modules/create` and `.../modules/[moduleId]/edit`             | `ModuleCreateDialog.tsx`, `EditModule.tsx`             | `useCreateModule`, `useUpdateModule`           | `module.api.ts`      |
| `.../[moduleId]/lessons/create` and `.../lessons/[lessonId]/edit`                  | `CreateLessonForm.tsx`, `EditLessonForm.tsx`           | `useCreateLesson`, `useUpdateLesson`           | `lesson.api.ts`      |

### 3. Student Learning Experience & Interactive Execution

| App route                                              | UI component                          | Custom hook                                | API service         |
| ------------------------------------------------------ | ------------------------------------- | ------------------------------------------ | ------------------- |
| `/(public)/courses` and `/(public)/courses/[courseId]` | `CourseList.tsx`, `CourseDetails.tsx` | `useGetPublicCourses`, `useGetCourseById`  | `course.api.ts`     |
| `/(dashboard)/student/courses`                         | `StudentCourseList.tsx`               | `useGetEnrolledCourses`                    | `enrollment.api.ts` |
| `.../student/courses/[courseId]`                       | `StudentSuperModuleList.tsx`          | `useGetCourseStructure`                    | `course.api.ts`     |
| `.../lessons/[lessonId]`                               | `StudentLessonDetails.tsx`            | `useGetLessonDetails`                      | `lesson.api.ts`     |
| Coding lesson                                          | `CodingLesson.tsx`                    | `useSubmitCode`                            | `judge.api.ts`      |
| Quiz lesson                                            | `QuizLesson.tsx`                      | `useSubmitQuiz`                            | `quiz.api.ts`       |
| Assignment lesson                                      | `AssignmentLesson.tsx`                | `useSubmitAssignment`                      | `assignment.api.ts` |
| Discussion board                                       | `DiscussionSection.tsx`               | `useGetDiscussions`, `useCreateDiscussion` | `discussion.api.ts` |

### 4. Payments, Enrollments & Certificates

| App route                                             | Feature component                                | Custom hook                             | API service          | Purpose                               |
| ----------------------------------------------------- | ------------------------------------------------ | --------------------------------------- | -------------------- | ------------------------------------- |
| `/(public)/courses/[courseId]`                        | `EnrollmentModal.tsx`                            | `useInitiatePayment`                    | `enrollment.api.ts`  | Start the enrollment/payment workflow |
| `/payment/callback`                                   | `PaymentCallbackPage.tsx`                        | `useVerifyPayment`                      | `payment.api.ts`     | Verify the payment callback           |
| `/(dashboard)/student/payments`                       | `StudentPaymentHistory.tsx`                      | `useGetMyPayments`                      | `payment.api.ts`     | Show the student's payment history    |
| `/(dashboard)/admin/payments`                         | `AdminPaymentManagement.tsx`, `RefundDialog.tsx` | `useGetAllPayments`, `useProcessRefund` | `payment.api.ts`     | Admin payment management and refunds  |
| `/(dashboard)/student/courses/[courseId]/certificate` | `CourseCertificateCard.tsx`                      | `useGetCertificate`                     | `certificate.api.ts` | Display course certificate            |
| `/verify/[certificateUid]`                            | `CertificateVerificationCard.tsx`                | `useVerifyCertificate`                  | `certificate.api.ts` | Verify a certificate publicly         |

### 5. Administration, Analytics & Users

| App route                       | Feature component            | Custom hook                           | API service        | Purpose                      |
| ------------------------------- | ---------------------------- | ------------------------------------- | ------------------ | ---------------------------- |
| `/(dashboard)/admin/analytics`  | `AdminOverviewDashboard.tsx` | `useGetAnalyticsOverview`             | `analytics.api.ts` | Display platform analytics   |
| `/(dashboard)/admin/audit-logs` | `AuditLogTable.tsx`          | `useGetAuditLogs`                     | `auditLog.api.ts`  | Review platform audit events |
| `/(dashboard)/admin/users`      | `AdminUserTable.tsx`         | `useGetAllUsers`, `useUpdateUserRole` | `user.api.ts`      | Manage users and roles       |
| `/(dashboard)/student/profile`  | `ProfileSettings.tsx`        | `useGetProfile`, `useUpdateProfile`   | `user.api.ts`      | View and update the profile  |

## State Management, Validation, and Authentication

### State management
- **TanStack React Query** manages API-driven server state, including queries, mutations, loading/error states, and cache invalidation.
- **Zustand** stores shared client-side state such as authentication and sidebar UI state.
- **React component state** handles local interactions that do not need global persistence.

### Form validation
- Feature forms use schemas from `src/validation/` where applicable.
- Zod schemas help validate input and define the expected shape of data before API submission.
- Form components use the form library appropriate to the feature.

### HTTP client and authentication flow
- API services in `src/api/*.api.ts` use the shared client in `src/lib/apiClient.ts`.
- The shared client is the central place for request configuration and common HTTP behavior.
- Authentication state is managed through the auth store/provider.
- Depending on the configured backend and current implementation, authenticated requests may use a Bearer token or cookie-based credentials. Confirm the exact token source and refresh behavior in `src/lib/apiClient.ts` and the auth provider before relying on specific interceptor behavior.
- Unauthorized responses should be handled consistently with the application's authentication/session flow.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (use a version compatible with the installed Next.js version)
- npm, pnpm, yarn, or another package manager compatible with the lockfile
- Access to the backend API, either locally or through a deployed environment

### 1. Clone the repository

```bash
git clone https://github.com/mahfahim/interactive-programming-learning-platform-frontend.git
cd interactive-programming-learning-platform-frontend
```

### 2. Install dependencies

Use the package manager that matches the lockfile in the repository. For npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the backend base URL variable expected by the API client. Example:

```env
NEXT_PUBLIC_API_URL=https://code-bd-code-backend.vercel.app
```

**Important:** `NEXT_PUBLIC_API_URL` is an example name. Check `src/lib/apiClient.ts` to confirm the exact environment variable used by the current implementation. If your client expects a different variable, use that name instead. Do not commit secrets or private credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build

```bash
npm run build
npm run start
```

## Environment Variables

| Variable              | Description                                                                                                          | Example                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Example public environment variable for the backend API base URL; confirm the actual name in `src/lib/apiClient.ts`. | `https://code-bd-code-backend.vercel.app` |

Only add environment variables that are actually read by the project. Any variable prefixed with `NEXT_PUBLIC_` is exposed to the browser bundle, so never put passwords, private API keys, or other secrets in it.

## Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Run the local Next.js development server   |
| `npm run build`    | Build the application for production       |
| `npm run start`    | Start the production server after building |
| `npm run lint`     | Run Biome checks                           |
| `npm run lint:fix` | Run Biome checks and apply supported fixes |
| `npm run format`   | Format files with Biome                    |

Check `package.json` if scripts or package-manager commands change.

## Backend Integration

The frontend uses feature-specific API service modules and a shared HTTP client to communicate with the backend.

- Backend repository: https://github.com/mahfahim/interactive-programming-learning-platform-backend
- API documentation: https://documenter.getpostman.com/view/52004920/2sBYB1MTLY
- Backend deployment: https://code-bd-code-backend.vercel.app/

### API service modules

| Service module       | Responsibility                                        |
| -------------------- | ----------------------------------------------------- |
| `auth.api.ts`        | Authentication and account flows                      |
| `course.api.ts`      | Public courses, course details, and course structures |
| `superModule.api.ts` | Super-module operations                               |
| `module.api.ts`      | Module operations                                     |
| `lesson.api.ts`      | Lesson content and progress                           |
| `enrollment.api.ts`  | Enrollment and enrolled-course workflows              |
| `judge.api.ts`       | Code execution/judging requests                       |
| `quiz.api.ts`        | Quiz workflows                                        |
| `assignment.api.ts`  | Assignment and submission workflows                   |
| `discussion.api.ts`  | Lesson/course discussions                             |
| `payment.api.ts`     | Payment history, verification, and administration     |
| `certificate.api.ts` | Certificate retrieval and verification                |
| `user.api.ts`        | User/profile management                               |
| `analytics.api.ts`   | Admin analytics                                       |
| `auditLog.api.ts`    | Audit-log retrieval                                   |

## UI and Styling

- **Tailwind CSS** provides utility-first styling.
- **shadcn/ui and Radix UI** provide reusable, accessible UI primitives.
- **Lucide React** provides icons.
- Feature-specific components are grouped under `src/components/modules/`.
- Shared components are located in `src/components/shared/`, while reusable UI primitives are in `src/components/ui/`.
- Theme-related behavior is managed through the project's theme provider and `next-themes`, where configured.

## Deployment

The application can be deployed to a platform that supports Next.js, such as Vercel.

1. Push the frontend repository to your Git provider.
2. Import the repository into the deployment platform.
3. Configure the backend API base URL using the exact environment variable read by `src/lib/apiClient.ts`.
4. Ensure the deployed backend accepts requests from the frontend origin and that authentication/cookie settings are compatible with the production domain.
5. Deploy and test login, course browsing, course enrollment, lesson access, payments, and certificate verification.

For production, verify CORS settings, secure cookie configuration (if cookies are used), API URLs, and payment callback URLs with the backend configuration.

## Troubleshooting

### API requests fail
- Confirm the backend is reachable.
- Verify the environment variable name and value used by `src/lib/apiClient.ts`.
- Check browser developer tools for the request URL, status code, and response body.
- Confirm backend CORS configuration permits the frontend origin.

### Authentication does not persist
- Inspect the auth provider, auth store, and shared API client.
- Confirm the backend's token/cookie strategy and refresh endpoint configuration.
- Check cookie domain, `SameSite`, `Secure`, and credential settings if cookie-based authentication is used.

### Build or type-check errors
- Install dependencies using the package manager associated with the lockfile.
- Run `npm run lint` and `npm run build`.
- Review recent changes to TypeScript types, API response shapes, and validation schemas.

### Payment callback issues
- Confirm the frontend callback route matches the backend payment provider configuration.
- Check the browser network panel and backend logs for payment initiation and verification errors.
- Never mark a payment successful based only on a client-side redirect; the backend must verify the transaction.

## Contributing

1. Create a feature branch.
2. Keep UI, hooks, API services, types, and validation schemas separated by responsibility.
3. Reuse shared components and existing project conventions.
4. Run lint checks and a production build before submitting changes.
5. Open a pull request describing the feature or fix.

## License

Add the license that applies to this repository. If no license file exists yet, the project's reuse and distribution terms have not been specified in this README.
