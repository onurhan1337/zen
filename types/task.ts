export type Status = "todo" | "in progress" | "done" | "backlog";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
};

export type BoardSections = {
  [name: string]: Task[];
};

export type BoardSectionsType = BoardSections;
