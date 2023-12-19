import Head from "next/head";
import { useSession } from "next-auth/react";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { DataTable } from "@/components/tasks/data-table";
import { columns } from "@/components/tasks/components/columns";
import { Task } from "types/task";

export default function TasksIndex() {
  const { data: session } = useSession();
  const { data: tasks, error } = useSWR<Task[]>("/api/task", fetcher);

  if (error) return <div>failed to load</div>;
  // TODO: Add skeleton loader
  if (!tasks) return <div>loading...</div>;

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
              <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
                Tasks
              </h1>
              <DataTable columns={columns} data={tasks} />
            </div>
          </div>
        </div>
      ) : (
        <LoginForSeeTasks />
      )}
    </>
  );
}

const LoginForSeeTasks = () => {
  return (
    <div className="flex w-full max-w-screen-xl items-center justify-between">
      <div className="inline-flex w-full flex-col items-start justify-center gap-8">
        <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
          Tasks
        </h1>
        <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-medium tracking-tight text-gray-600">
            You must be{" "}
            <span className="underline underline-offset-4">logged in</span> to
            see your tasks.
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
