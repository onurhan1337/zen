import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Separator } from "@radix-ui/themes";

import { Task } from "types/task";
import TaskItem from "./taskItem";
import SortableTaskItem from "./sortableTaskItem";
import { cn } from "@/lib/utils";

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
    <div className="w-full bg-white">
      <div
        className={cn(
          "flex",
          isMobile
            ? "flex-col items-start py-4"
            : "flex-row items-center justify-between",
        )}
      >
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          {title}
        </h4>
        <Separator
          orientation={isMobile ? "horizontal" : "vertical"}
          size={isMobile ? "4" : "3"}
        />
      </div>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="pr-0 sm:pr-4">
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
