// src/type/common.type.ts

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface IQuery {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
  [key: string]: unknown;
}

export interface IRequestUser {
  userId: string;
  role: string;
  email?: string;
}
