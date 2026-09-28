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
