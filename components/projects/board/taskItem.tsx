import { useState } from "react";

import TaskDetailModal from "@/components/tasks/detail";
import { truncate } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { Task } from "types/task";
import { Badge } from "@radix-ui/themes";
import {
  ArrowBottomRightIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const onOpen = () => setOpen(!isOpen);

  const handleIconForPriority = (priority: string) => {
    switch (priority) {
      case "low":
        return <ArrowBottomRightIcon className="h-3 w-3 text-gray-400" />;
      case "medium":
        return <ArrowRightIcon className="h-3 w-3 text-gray-400" />;
      case "high":
        return <ArrowTopRightIcon className="h-3 w-3 text-gray-400" />;
      default:
        <ArrowBottomRightIcon className=" text-gray-400" />;
        break;
    }
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="rounded-md border border-zinc-200 bg-white p-4"
      >
        <div
          className="flex cursor-move items-center justify-between"
          draggable
          role="button"
        >
          <h4 className="antialised scroll-m-20 text-lg font-medium tracking-tight md:subpixel-antialiased">
            {truncate(task.name, 15)}
          </h4>{" "}
          <GripVertical size={16} className="text-gray-500" />
        </div>

        <p className="antialised text-sm font-normal leading-7  md:subpixel-antialiased">
          {truncate(task.description, 30)}
        </p>

        <Badge className="mt-2" size={"1"} color="gray" radius="full">
          {task.priority.toUpperCase()} {handleIconForPriority(task.priority)}
        </Badge>
      </div>

      <TaskDetailModal taskId={task.id} isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default TaskItem;
