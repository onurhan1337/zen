import { useRouter } from "next/router";
import { Button } from "@radix-ui/themes";
import { Project } from "@prisma/client";
import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const { id, name, status, description } = project;
  const router = useRouter();

  return (
    <div className="flex cursor-pointer flex-col justify-between space-y-2 rounded-md border border-zinc-200 bg-white p-4 hover:bg-zinc-100">
      <div className="flex items-center justify-start gap-2">
        {status === "active" ? (
          <Badge type="active" />
        ) : (
          <Badge type="inactive" />
        )}
      </div>
      <div>
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          {name}
        </h4>
      </div>
      <div className="py-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {truncate(description, 46)}
        </p>
      </div>
      <div className="py-2">
        <Button
          onClick={() => {
            router.push(`/projects/${id}`);
          }}
          color={"indigo"}
          variant={"soft"}
          className="w-full cursor-pointer"
        >
          Go Details
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
