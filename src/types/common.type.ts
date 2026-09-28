// src/type/common.type.ts
import type {
  AuthProvider,
  ProficiencyLevel,
  Role,
  SocialPlatform,
  UserStatus,
} from "./enum.type";

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

export interface Country {
  id: string;
  name: string;
  divisions?: Division[];
}

export interface Division {
  id: string;
  countryId: string;
  country?: Country;
  name: string;
  districts?: District[];
}

export interface District {
  id: string;
  divisionId: string;
  division?: Division;
  name: string;
  cities?: City[];
}

export interface City {
  id: string;
  districtId: string;
  district?: District;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface User {
  id: string;
  role: Role;
  name?: string | null;
  email: string;
  status: UserStatus;
  password?: string | null;
  googleId?: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  needPasswordChange: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string | null;
}

export interface UserDescription {
  userId: string;
  bio?: string | null;
  cityId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSocial {
  id: string;
  userDescriptionId: string;
  platform: SocialPlatform;
  url: string;
}

export interface UserEducation {
  id: string;
  userDescriptionId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
}

export interface UserExperience {
  id: string;
  userDescriptionId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface UserWebsite {
  id: string;
  userDescriptionId: string;
  title: string;
  url: string;
}

export interface UserSkill {
  userDescriptionId: string;
  skillId: string;
  proficiencyLevel: ProficiencyLevel;
}
