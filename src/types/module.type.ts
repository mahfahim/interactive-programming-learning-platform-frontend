// src/types/module.type.ts
export interface ICreateModuleInput {
  superModuleId: string;
  title: string;
  displayOrder: number;
}

export interface IUpdateModuleInput {
  title?: string;
  displayOrder?: number;
}

export interface IModule {
  id: string;
  superModuleId: string;
  title: string;
  description?: string | null;
  displayOrder: number;
  lessons?: unknown[];
}
