import Head from "next/head";
import { useSession } from "next-auth/react";

import ProjectCreateContent from "@/components/home/projects/create";
import ProjectsCardList from "@/components/home/projects/list";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Zen</title>
        <meta name="description" content="Zen - Project Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session && (
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-screen-xl items-center justify-between">
            <div className="inline-flex w-full flex-col items-start justify-center gap-8">
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                  Projects
                </h1>
                <ProjectCreateContent />
              </div>
              <ProjectsCardList />
            </div>
          </div>
        </div>
      )}

      {!session && (
        <div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-slate-500 via-zinc-600 to-slate-500 bg-clip-text text-transparent">
                Zen
              </span>{" "}
              - Project Manager
            </h1>
            <p className="text-md text-zinc-500 antialiased">
              Sign in to create a project
            </p>
          </div>
        </div>
      )}
    </>
  );
}
