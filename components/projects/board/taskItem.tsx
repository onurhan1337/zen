import TaskDetailModal from "@/components/tasks/detail";
import { truncate } from "@/lib/utils";
import {
  ArrowBottomRightIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

import { Badge } from "@radix-ui/themes";
import { GripVertical } from "lucide-react";
import { Task } from "types/task";

type TaskItemProps = {
  task: Task;
};

export const handleIconForPriority = (priority: string) => {
  switch (priority) {
    case "low":
      return <ArrowBottomRightIcon className="h-3 w-3 text-zinc-400" />;
    case "medium":
      return <ArrowRightIcon className="h-3 w-3 text-zinc-400" />;
    case "high":
      return <ArrowTopRightIcon className="h-3 w-3 text-zinc-400" />;
    default:
      return <ArrowBottomRightIcon className=" text-zinc-400" />;
  }
};

const TaskItem = ({ task }: TaskItemProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const onOpen = () => setOpen(!isOpen);

  return (
    <>
      <div
        onClick={onOpen}
        className="rounded-md border border-zinc-800 p-4"
      >
        <div
          className="flex cursor-move items-center justify-between"
          draggable
          role="button"
        >
          <h4 className="antialised scroll-m-20 text-lg font-medium tracking-tight md:subpixel-antialiased">
            {truncate(task.name, 15)}
          </h4>{" "}
          <GripVertical size={16} className="text-zinc-500" />
        </div>

        <p className="antialised text-sm font-normal leading-7  md:subpixel-antialiased">
          {truncate(task.description, 30)}
        </p>

        {task.assignee && (
          <Badge
            className="mt-2 border border-blue-900 bg-blue-50 uppercase text-blue-500"
            size={"1"}
            radius="full"
          >
            {task.assignee.name}
          </Badge>
        )}
      </div>

      <TaskDetailModal taskId={task.id} isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default TaskItem;
