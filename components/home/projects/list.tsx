import { PlusCircleIcon } from "lucide-react";
import ProjectCard from "./card";
import { Project } from "types/project";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Project 1",
    description:
      "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.",
    tags: ["school", "work"],
  },
  {
    id: 2,
    title: "Project 2",
    description:
      "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.",
    tags: ["work"],
  },
  {
    id: 3,
    title: "Project 3",
    description:
      "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.",
    tags: [],
  },
];

const ProjectsCardList = () => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      <div className="flex cursor-pointer flex-col justify-around space-y-2 rounded-md border border-zinc-200 bg-white p-4 hover:bg-zinc-200">
        <PlusCircleIcon className="mx-auto h-10 w-10 text-zinc-200" />
        <p className="text-center text-gray-500">Create Project</p>
      </div>
    </div>
  );
};

export default ProjectsCardList;
