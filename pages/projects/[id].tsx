import { useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Task } from "types/task";
import {Project, User} from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSettingsContent from "@/components/projects/settings/content";
import BoardSectionList from "@/components/projects/board/list";
import TaskCreateContent from "@/components/tasks/create";

import fetcher from "@/lib/fetcher";
import Badge from "@/components/shared/badge";
import {isUserOwner, truncate} from "@/lib/utils";
import Container from "@/components/ui/container";

export default function ProjectDetailIndex() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data: project } = useSWR<Project & { owners: User[], members: User[] }>(
    id ? `/api/project/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const { data: tasks } = useSWR<Task[]>(
    id ? `/api/project/${id}/task` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const memoizedTasks = useMemo(() => {
    if (!tasks) return null;
    return tasks;
  }, [tasks]);

  const isOwner = project ? isUserOwner(project.owners, session) : false;
  return (
    <>
      <Head>
        <title>{`${project?.name || ""} | Zen`}</title>
        <meta name="description" content={project?.description || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session ? (
        project ? (
          <section className="flex w-full flex-col items-center">
            <ProjectDetailContent project={project} />
            <div className="w-full max-w-screen-xl py-4">
              {isOwner ? (
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
                  {tasks && (
                    <TabsContent value="tasks">
                      {memoizedTasks && memoizedTasks.length > 0 ? (
                        <BoardSectionList INITIAL_TASKS={memoizedTasks} />
                      ) : (
                        <TasksEmptyCard />
                      )}
                    </TabsContent>
                  )}
                  <TabsContent value="settings">
                    <Container>
                      <ProjectSettingsContent projectId={project.id} />
                    </Container>
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  {tasks && (
                    <div>
                      {memoizedTasks && memoizedTasks.length > 0 ? (
                        <BoardSectionList INITIAL_TASKS={memoizedTasks} />
                      ) : (
                        <TasksEmptyCard />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        ) : (
          <PageLoadingState />
        )
      ) : (
        <div className="flex w-full flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-zinc-500">
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
        <h1 className="scroll-m-20 text-4xl font-extrabold italic tracking-tight antialiased lg:text-3xl">
          {truncate(project.name, 20)}
        </h1>
        <p className=" pt-2 text-sm font-medium text-gray-500 antialiased">
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
        <div className="flex w-full max-w-screen-xl flex-row items-center justify-between border-b border-zinc-700 pb-4">
          <div className="flex w-1/2 flex-col items-start justify-center gap-4">
            <div className="h-8 w-1/2 rounded bg-zinc-800"></div>
            <div className="h-4 w-1/3 rounded bg-zinc-800"></div>
          </div>

          <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
        </div>

        <div className="w-full max-w-screen-xl py-4">
          <Tabs defaultValue="tasks">
            <div className="flex w-full flex-col items-center justify-center">
              <TabsList className="flex w-full max-w-screen-sm items-center justify-center">
                <div className="h-8 w-full rounded bg-zinc-800"></div>
                <div className="h-8 w-full rounded bg-zinc-800"></div>
              </TabsList>
            </div>
            <TabsContent value="tasks">
              <div className="flex w-full flex-col items-center justify-center py-12">
                <div className="h-4 w-5/6 rounded bg-zinc-800"></div>
                <div className="h-4 w-5/6 rounded bg-zinc-800"></div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="h-4 w-5/6 rounded bg-zinc-800"></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

const TasksEmptyCard = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12">
      <div className="flex w-full flex-col text-center">
        <svg
          className="mx-auto h-12 w-12 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-zinc-400">No tasks</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Get started by creating a new task.
        </p>
      </div>
    </div>
  );
};
