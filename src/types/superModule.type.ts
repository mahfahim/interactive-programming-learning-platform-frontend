// src/types/superModule.type.ts
import type { IModule } from "./module.type";

export interface ICreateSuperModuleInput {
  courseId: string;
  title: string;
  displayOrder: number;
}

export interface IUpdateSuperModuleInput {
  title?: string;
  displayOrder?: number;
}

export interface ISuperModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  displayOrder: number;
  modules?: IModule[];
}
