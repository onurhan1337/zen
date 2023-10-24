import { useState } from "react";
import { useRouter } from "next/router";
import { Project } from "@prisma/client";
import { Button, DropdownMenu, Text, Flex, Switch } from "@radix-ui/themes";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { truncate } from "@/lib/utils";
import Badge from "@/components/shared/badge";
import { LoadingDots } from "@/components/shared/icons";

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
        <CardActionMenu id={id} />
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
          color={"lime"}
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

const CardActionMenu = ({ id }: { id: string }) => {
  const router = useRouter();

  // delete project

  // if user clicks delete and waits for response, toast loading
  // if user clicks delete and response is successful, toast success
  const deleteProject = async () => {
    try {
      const res = await fetch("/api/project", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Project deleted");
        router.push("/");
      }

      if (!res.ok) {
        const error = await res.text();
        toast.error(error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant={"ghost"} color={"gray"}>
          <MoreHorizontal size={14} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="hover:bg-gray-200 hover:text-gray-500">
          <Text as="label" size="2">
            <Flex gap="2">
              <Switch color="lime" disabled />
              Status
            </Flex>
          </Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={deleteProject} color="red">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
