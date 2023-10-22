import { GetServerSidePropsContext } from "next";
import { Button } from "@radix-ui/themes";
import ProjectCreateContent from "@/components/home/projects/create";

import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useDrawerStore } from "@/lib/store";
import { Project } from "@prisma/client";

import ProjectsCardList from "@/components/home/projects/list";

type Props = {
  projects: Project[] | null;
};

export default function Home({ projects }: Props) {
  const { isOpen, setOpen } = useDrawerStore();

  const { data: session } = useSession();

  return (
    <>
      {session && (
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-screen-xl items-center justify-between">
            <div className="inline-flex w-full flex-col items-start justify-center gap-8">
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                  Projects{" "}
                </h1>
                <Button onClick={() => setOpen(!isOpen)} variant="classic">
                  Create Project
                </Button>
              </div>
              {projects && projects.length > 0 ? (
                <ProjectsCardList projects={projects} />
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                    No Projects
                  </h1>
                  <p className="text-lg text-gray-500">
                    Create a project to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!session && (
        <div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
              Welcome to Zen - Project Manager
            </h1>
            <p className="text-lg text-gray-500">Sign in to create a project</p>
          </div>
        </div>
      )}

      <ProjectCreateContent />
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context);

  // if not session, get empty state component
  if (!session) {
    return {
      props: {
        projects: [],
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      email: session.user.email,
    },
  });

  if (!user) {
    return {
      props: {
        projects: [],
      },
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
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
  }));

  return {
    props: {
      projects: serializedProjects,
    },
  };
};
