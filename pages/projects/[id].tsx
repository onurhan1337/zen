import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

type Props = {
  project: {
    id: string;
    name: string;
    status: string;
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
    <div>
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <p className="text-sm text-gray-500">{project.description}</p>
    </div>
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
