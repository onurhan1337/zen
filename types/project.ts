export interface Project {
  id: string;
  name: string;
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
  description: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}
