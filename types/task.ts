export type Status = "backlog" | "todo" | "in-progress" | "done";

export enum TaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export type Task = {
  id: string;
  name: string;
  startDate: string;
  status: TaskStatusType;
  endDate: string;
  description: string;
};

export type BoardSections = {
  [name: string]: Task[];
};

export type BoardSectionsType = BoardSections;
