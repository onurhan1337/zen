import { useState } from "react";
import { useRouter } from "next/router";
import { Project } from "@prisma/client";

import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";
import { LoadingDots } from "@/components/shared/icons";
import { Button } from "@radix-ui/themes";
import DeleteConfirmationDialog from "@/components/projects/settings/confirm";

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
          {status === "active" ? (
            <Badge type="active" />
          ) : (
            <Badge type="inactive" />
          )}
        </div>
        <DeleteConfirmationDialog id={id} hasLabel={false} />
      </div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
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
