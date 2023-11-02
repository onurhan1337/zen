export type Status = "backlog" | "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  name: string;
  startDate: string;
  status: "backlog" | "todo" | "in-progress" | "done";
  endDate: string;
  description: string;
};

export type BoardSections = {
  [name: string]: Task[];
};

export type BoardSectionsType = BoardSections;
