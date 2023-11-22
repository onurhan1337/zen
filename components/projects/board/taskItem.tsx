import { useState } from "react";

import TaskDetailModal from "@/components/tasks/detail";
import { truncate } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { Task } from "types/task";

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const onOpen = () => setOpen(!isOpen);

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
          <h5 className="text-lg font-semibold">{truncate(task.name, 15)}</h5>
          <GripVertical size={16} className="text-gray-500" />
        </div>
        <p>{truncate(task.description, 20)}</p>
      </div>
      <TaskDetailModal taskId={task.id} isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default TaskItem;
