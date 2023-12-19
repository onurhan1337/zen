import { useState, useMemo } from "react";
import useSWR from "swr";
import { Project } from "@prisma/client";

import fetcher from "@/lib/fetcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectCard from "./card";
import ProjectsEmptyCard from "./empty";
import { Input } from "@/components/ui/input";

type Data = {
  projects: Project[];
};

export default function ProjectsCardList() {
  const { data } = useSWR<Data>("/api/project", fetcher, {
    revalidateOnFocus: false,
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const memoizedData = useMemo(() => {
    if (!data || !data.projects) return null;
    return data;
  }, [data]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredProjects = useMemo(
    () =>
      memoizedData?.projects.filter(
        (project) =>
          (filter === "all" || project.status === filter) &&
          project.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [memoizedData, filter, search],
  );

  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearchChange}
        />

        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"All"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects && (
        <>
          {filteredProjects.length > 0 ? (
            <div className="mb-4 grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
              {filteredProjects.map((project: Project) => (
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
