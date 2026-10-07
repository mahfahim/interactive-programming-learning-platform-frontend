// src/types/user.type.ts

import type {
  AuthProvider,
  ProficiencyLevel,
  Role,
  SocialPlatform,
  UserStatus,
} from "./enum.type";

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

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IUserFilterRequest extends IPaginationOptions {
  search?: string;
  role?: Role;
  status?: UserStatus;
}

export interface IAdminUpdateUserDto {
  name?: string;
  role?: Role;
  status?: UserStatus;
  isDeleted?: boolean;
}

export interface IUpdateUserProfileDto {
  name?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  bio?: string | null;
  cityId?: string | null;
}

export interface ISyncEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | Date;
  endDate?: string | Date | null;
}

export interface ISyncEducationsDto {
  educations: ISyncEducationItem[];
}

export interface ISyncExperienceItem {
  company: string;
  position: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string | null;
}

export interface ISyncExperiencesDto {
  experiences: ISyncExperienceItem[];
}

export interface ISyncSkillItem {
  skillId: string;
  proficiencyLevel?: ProficiencyLevel;
}

export interface ISyncSkillsDto {
  skills: ISyncSkillItem[];
}

export interface ISyncSocialItem {
  platform: SocialPlatform;
  url: string;
}

export interface ISyncSocialsDto {
  socials: ISyncSocialItem[];
}

export interface ISyncWebsiteItem {
  title: string;
  url: string;
}

export interface ISyncWebsitesDto {
  websites: ISyncWebsiteItem[];
}

export type IUserSkillWithDetail = UserSkill & {
  skill: Skill;
};

export type IUserDescriptionAggregate = UserDescription & {
  city: City | null;
  socials: UserSocial[];
  educations: UserEducation[];
  experiences: UserExperience[];
  websites: UserWebsite[];
  skills: IUserSkillWithDetail[];
};

export type IUserProfileResponse = Omit<User, "password"> & {
  description: IUserDescriptionAggregate | null;
};

export interface IPaginatedResult<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T[];
}
