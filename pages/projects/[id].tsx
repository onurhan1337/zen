import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

import Badge from "@/components/shared/badge";
import BoardSectionList from "@/components/projects/board/list";

type Props = {
  project: {
    id: string;
    name: string;
    status: "active" | "inactive";
    startDate: Date;
    endDate: Date;
    description: string;
    user: {
      email: string;
    };
  } | null; // Updated to handle null if the project is not found.
};

export default function ProjectDetailIndex({ project }: Props) {
  // TODO: Add here empty state card
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <Head>
        <title>{project.name} | Zen</title>
        <meta name="description" content={project.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-screen-xl flex-row items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold italic tracking-tight lg:text-5xl">
              {project.name}
            </h1>
            <p className=" text-sm text-gray-500">{project.description}</p>
          </div>
          <Badge type={project.status} />
        </div>
        <div className="flex w-full max-w-screen-xl flex-row items-center justify-between ">
          <BoardSectionList
            INITIAL_TASKS={[
              {
                id: "1",
                title: "Task 1",
                description: "Description 1",
                status: "todo",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { id } = context.query;
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  // if user is not the owner of the project
  if (user?.id !== project?.userId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        startDate: JSON.parse(JSON.stringify(project.startDate)),
        endDate: JSON.parse(JSON.stringify(project.endDate)),
        description: project.description,
        user: {
          email: user.email,
        },
      },
    },
  };
};
