// src/types/quiz.type.ts

export interface ISubmitQuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface ISubmitQuizPayload {
  quizLessonId: string;
  answers: ISubmitQuizAnswer[];
}
