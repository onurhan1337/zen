import { useState } from "react";
import { useRouter } from "next/router";
import { Project } from "@prisma/client";

import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";
import { LoadingDots } from "@/components/shared/icons";
import { Button } from "@radix-ui/themes";
import DeleteConfirmationDialog from "@/components/projects/settings/confirm";
import { ProjectStatus } from "types/project";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const { id, name, status, description } = project;
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between space-y-2 rounded-md border border-zinc-200 bg-white p-4 hover:bg-zinc-100">
      <div className="flex items-center justify-between gap-2">
        <div>
          {status === ProjectStatus.ACTIVE ? (
            <Badge type="active" />
          ) : (
            <Badge type="inactive" />
          )}
        </div>
        <DeleteConfirmationDialog id={id} hasLabel={false} />
      </div>
      <div>
        <h4 className="antialised scroll-m-20 text-lg font-medium tracking-tight md:subpixel-antialiased">
          {truncate(name, 15)}
        </h4>
      </div>
      <div className="py-2">
        <p className="antialised text-sm font-normal leading-7  md:subpixel-antialiased [&:not(:first-child)]:mt-6">
          {truncate(description, 30)}
        </p>
      </div>
      <div className="py-2">
        <Button
          onClick={() => {
            setClicked(true);
            router.push(`/projects/${id}`);
          }}
          color={"teal"}
          variant={"soft"}
          disabled={clicked}
          className="w-full "
        >
          {clicked ? <LoadingDots color="#808080" /> : "View Project"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
