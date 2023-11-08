import { GripVertical } from "lucide-react";
import { Task } from "types/task";

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <div
        className="flex cursor-move items-center justify-between"
        draggable
        role="button"
      >
        <h5 className="text-lg font-semibold">{task.name}</h5>
        <GripVertical size={16} className="text-gray-500" />
      </div>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskItem;
