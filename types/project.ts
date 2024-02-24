import { Task } from "./task";
import {User} from "@prisma/client";

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  status: ProjectStatus;
  userId: string;
  owners: User[];
  members: User[];
  tasks: Task[]; // You need to define the Task interface
}

export enum ProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export type ProjectStatusType =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];
