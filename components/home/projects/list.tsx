import { useMemo } from "react";
import useSWR from "swr";

import { Project } from "@prisma/client";
import ProjectCard from "./card";
import fetcher from "@/lib/fetcher";
import ProjectsEmptyCard from "./empty";

type Data = {
  projects: Project[];
};

export default function ProjectsCardList() {
  const { data, isValidating, error } = useSWR<Data>("/api/project", fetcher, {
    revalidateOnFocus: false,
  });

  const memoizedData = useMemo(() => {
    if (!data || !data.projects) return null;
    return data;
  }, [data]);

  if (isValidating) {
    return (
      <div className="mb-4 grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col justify-between space-y-2 rounded-md border border-zinc-200 bg-white p-4"
            >
              <div className="h-4 bg-gray-200"></div>
              <div className="h-6 bg-gray-200"></div>
              <div className="h-20 bg-gray-200"></div>
              <div className="h-10 bg-gray-200"></div>
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return <div>Failed to load projects</div>;
  }

  return (
    <>
      {memoizedData && (
        <>
          {memoizedData.projects && memoizedData.projects.length > 0 ? (
            <div className="mb-4 grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
              {memoizedData.projects.map((project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <ProjectsEmptyCard />
          )}
        </>
      )}
    </>
  );
}
