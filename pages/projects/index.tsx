import Head from "next/head";
import { useSession } from "next-auth/react";

import ProjectCreateContent from "@/components/home/projects/create";
import ProjectsCardList from "@/components/home/projects/list";

export default function ProjectsIndex() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Projects | Zen</title>
        <meta
          name="description"
          content="Zen is a project management tool for software developers. It allows you to organize your work, manage tasks and projects."
        />
      </Head>
      {session ? (
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-screen-xl items-center justify-between">
            <div className="inline-flex w-full flex-col items-start justify-center gap-8">
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
                  Projects
                </h1>
                <ProjectCreateContent />
              </div>
              <ProjectsCardList />
            </div>
          </div>
        </div>
      ) : (
        <LoginForSeeProjects />
      )}
    </>
  );
}

const LoginForSeeProjects = () => {
  return (
    <div className="flex w-full max-w-screen-xl items-center justify-between">
      <div className="inline-flex w-full flex-col items-start justify-center gap-8">
        <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
          Projects
        </h1>
        <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-medium tracking-tight text-gray-600">
            You must be{" "}
            <span className="underline underline-offset-4">logged in</span> to
            see your projects.
          </p>
          <p className="text-lg font-medium tracking-tight text-gray-600">
            If you don&apos;t have an account, you can register by clicking the
            button at the top right.
          </p>
        </div>
      </div>
    </div>
  );
};
