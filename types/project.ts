import { Task } from "./task";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  status: ProjectStatus;
  userId: string;
  owner: User;
  members: User[];
  tasks: Task[]; // You need to define the Task interface
}

export enum ProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export type ProjectStatusType =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];
