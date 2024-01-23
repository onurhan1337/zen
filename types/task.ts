import { User } from "@prisma/client";

export type Status = "backlog" | "todo" | "inProgress" | "done";

export enum TaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export type Task = {
  id: string;
  name: string;
  startDate: string;
  status: TaskStatusType;
  endDate: string;
  priority: Priority;
  assignee: User | null;
  ownerId: string;
  memberId: string[];
  description: string;
};

export type BoardSections = {
  [name: string]: Task[];
};

export type BoardSectionsType = BoardSections;
