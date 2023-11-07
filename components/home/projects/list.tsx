import { Project } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import ProjectCard from "./card";

type Props = {
  projects: Project[] | null;
};

export default function ProjectsCardList({ projects }: Props) {
  return (
    <div className="mb-4 grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
      {projects &&
        projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
    </div>
  );
}
