import { useSession } from "next-auth/react";

import ProjectCreateContent from "@/components/home/projects/create";
import ProjectsCardList from "@/components/home/projects/list";

export default function ProjectsIndex() {
  const { data: session } = useSession();

  return (
    <>
      {session && (
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
      )}
    </>
  );
}
