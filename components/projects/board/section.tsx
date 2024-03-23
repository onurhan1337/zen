import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";

import { cn } from "@/lib/utils";
import { Task } from "types/task";
import SortableTaskItem from "./sortableTaskItem";
import TaskItem from "./taskItem";

type BoardSectionProps = {
  id: string;
  title: string;
  tasks: Task[];
};

const BoardSection = ({ id, title, tasks }: BoardSectionProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="w-full rounded-md p-4 shadow-sm sm:p-3">
      <div
        className={cn(
          "flex",
          isMobile
            ? "flex-col items-start py-4"
            : "flex-row items-center justify-between",
        )}
      >
        <h4 className="mb-4 scroll-m-20 text-lg font-semibold tracking-tighter
          bg-zinc-900 border border-zinc-800 w-full rounded-md shadow-sm p-2 text-center
        ">
          {title}
        </h4>
      </div>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div key={task.id}>
              <SortableTaskItem id={task.id}>
                <TaskItem task={task} />
              </SortableTaskItem>
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default BoardSection;
