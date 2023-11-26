import useSWR from "swr";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Task } from "types/task";
import { Project } from "types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSettingsContent from "@/components/projects/settings/content";
import BoardSectionList from "@/components/projects/board/list";
import TaskCreateContent from "@/components/tasks/create";
import fetcher from "@/lib/fetcher";
import { useMemo } from "react";
import Badge from "@/components/shared/badge";
import { truncate } from "@/lib/utils";

export default function ProjectDetailIndex() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const { data: project } = useSWR<Project>(`/api/project/${id}`, fetcher, {
    revalidateOnFocus: true,
  });

  const { data: tasks } = useSWR<Task[]>(`/api/project/${id}/task`, fetcher, {
    revalidateOnFocus: true,
  });
  const memoizedTasks = useMemo(() => {
    if (!tasks) return null;
    return tasks;
  }, [tasks]);

  return (
    <>
      <Head>
        <title>{`${project?.name || ""} | Zen`}</title>
        <meta name="description" content={project?.description || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session ? (
        project && tasks ? (
          <section className="flex w-full flex-col items-center">
            <ProjectDetailContent project={project} />
            <div className="w-full max-w-screen-xl py-4">
              <Tabs defaultValue="tasks">
                <div className="flex w-full flex-col items-center justify-center">
                  <TabsList className="flex w-full max-w-screen-sm items-center justify-center">
                    <TabsTrigger className="w-full" value="tasks">
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="settings">
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="tasks">
                  {memoizedTasks && memoizedTasks.length > 0 ? (
                    <BoardSectionList INITIAL_TASKS={memoizedTasks} />
                  ) : (
                    <div className="flex w-full flex-col items-center justify-center py-12">
                      <h1 className="text-2xl font-bold text-gray-500">
                        No tasks found
                      </h1>
                      <p className="text-gray-400">
                        Create a new task to get started
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="settings">
                  <div className="flex w-full flex-col items-center justify-center">
                    <ProjectSettingsContent projectId={project.id} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        ) : (
          <PageLoadingState />
        )
      ) : (
        <div className="flex w-full flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-gray-500">
            You don&apos;t have access to this project.
          </h1>
        </div>
      )}
    </>
  );
}

const ProjectDetailContent = ({ project }: { project: Project }) => {
  return (
    <div className="grid w-full max-w-screen-xl grid-cols-1 items-end justify-between gap-4 border-b border-zinc-200 pb-4 sm:grid-cols-2">
      <div className="w-full grid-cols-2 sm:grid-cols-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold italic tracking-tight lg:text-5xl">
          {truncate(project.name, 20)}
        </h1>
        <p className=" pt-2 text-sm text-gray-500">
          {truncate(project.description, 100)}
        </p>
      </div>
      <div className="flex w-full grid-cols-2 flex-row items-center justify-between space-x-4 sm:grid-cols-2 sm:justify-end">
        <Badge type={project.status} />
        <TaskCreateContent />
      </div>
    </div>
  );
};

const PageLoadingState = () => {
  return (
    <div className="animate-pulse">
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-screen-xl flex-row items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex w-1/2 flex-col items-start justify-center gap-4">
            <div className="h-8 w-1/2 rounded bg-gray-300"></div>
            <div className="h-4 w-1/3 rounded bg-gray-300"></div>
          </div>

          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        </div>

        <div className="w-full max-w-screen-xl py-4">
          <Tabs defaultValue="tasks">
            <div className="flex w-full flex-col items-center justify-center">
              <TabsList className="flex w-full max-w-screen-sm items-center justify-center">
                <div className="h-8 w-full rounded bg-gray-300"></div>
                <div className="h-8 w-full rounded bg-gray-300"></div>
              </TabsList>
            </div>
            <TabsContent value="tasks">
              <div className="flex w-full flex-col items-center justify-center py-12">
                <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                <div className="h-4 w-5/6 rounded bg-gray-300"></div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="h-4 w-5/6 rounded bg-gray-300"></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};
