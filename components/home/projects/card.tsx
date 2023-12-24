import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Project } from "types/project";

import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";
import { LoadingDots } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/projects/settings/confirm";
import { ProjectStatus } from "types/project";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const { data: session } = useSession();
  const [clicked, setClicked] = useState<boolean>(false);
  const { id, name, status, description, owner } = project;
  const router = useRouter();

  const isOwner = owner.id === session?.user?.id;

  return (
    <div className="flex flex-col justify-between space-y-2 rounded-md border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          {status === ProjectStatus.ACTIVE ? (
            <Badge type="active" />
          ) : (
            <Badge type="archived" />
          )}
        </div>
        {isOwner ? (
          <DeleteConfirmationDialog id={id} hasLabel={false} />
        ) : (
          <div>
            <span
              className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              title="Member"
            >
              MEMBER
            </span>
          </div>
        )}
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
          disabled={clicked}
          variant={"outline"}
          className="w-full bg-gray-100 font-sans hover:bg-gray-200"
        >
          {clicked ? <LoadingDots color="#808080" /> : "View Project"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
