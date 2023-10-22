import { Project } from "@prisma/client";
import { useDrawerStore } from "@/lib/store";
import { PlusCircleIcon } from "lucide-react";
import ProjectCard from "./card";

type Props = {
  projects: Project[] | null;
};

export default function ProjectsCardList({ projects }: Props) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
      {projects &&
        projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

      <EmptyCreateProjectCard />
    </div>
  );
}

const EmptyCreateProjectCard = () => {
  const { isOpen, setOpen } = useDrawerStore();

  return (
    <div
      onClick={() => setOpen(!isOpen)}
      className="group flex cursor-pointer flex-col justify-around space-y-2 rounded-md border border-zinc-200 p-4 hover:bg-zinc-100"
    >
      <PlusCircleIcon className="mx-auto h-10 w-10 text-zinc-200 group-hover:text-zinc-300" />
      <p className="text-center text-zinc-500">Create Project</p>
    </div>
  );
};
