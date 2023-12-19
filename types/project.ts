export interface Project {
  id: string;
  name: string;
  status: ProjectStatusType;
  startDate: string;
  endDate: string;
  description: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

export enum ProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export type ProjectStatusType =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];
