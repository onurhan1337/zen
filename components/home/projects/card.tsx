import { Project } from "types/project";
import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";

const ProjectCard = ({ project }: { project: Project }) => {
  const { title, description, tags } = project;

  if (!title || !description) {
    return null;
  }

  return (
    <div className="flex cursor-pointer flex-col justify-between space-y-2 rounded-md border border-zinc-200 bg-white p-4 hover:bg-black">
      <div>
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          {title}
        </h4>
        <div className="flex items-center justify-start gap-2">
          {tags &&
            tags.map((tag, index) => <Badge key={tag} id={index} text={tag} />)}
        </div>
      </div>
      <div className="py-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {truncate(description, 46)}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
