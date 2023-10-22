import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import ProjectCreateContent from "@/components/home/projects/create";

import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";

import ProjectsCardList from "@/components/home/projects/list";

type Props = {
  projects: Project[] | null;
};

export default function Home({ projects }: Props) {
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-screen-xl items-center justify-between">
        <div className="inline-flex w-full flex-col items-start justify-center gap-8">
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
              Projects{" "}
            </h1>
            <Button
              onClick={() => setOpenPopover(!openPopover)}
              variant="classic"
            >
              Create Project
            </Button>

            <ProjectCreateContent
              openPopover={openPopover}
              setOpenPopover={() => setOpenPopover}
            />
          </div>
          <ProjectsCardList projects={projects} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
  });

  // Convert Date objects to strings
  const serializedProjects = projects.map((project) => ({
    ...project,
    startDate: project.startDate?.toISOString(),
    endDate: project.endDate?.toISOString(),
  }));

  return {
    props: {
      projects: serializedProjects,
    },
  };
};
