import { cn } from "@/lib/utils";
import { TaskStatus } from "types/task";

const StatusBadge = ({ status }: { status: TaskStatus }) => {
  function getTaskStatus(status: TaskStatus) {
    switch (status) {
      case TaskStatus.BACKLOG:
        return "bg-gray-400/10 text-gray-400 ring-gray-400/20";
      case TaskStatus.TODO:
        return "bg-yellow-400/10 text-yellow-500 ring-yellow-400/20";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-400/10 text-blue-400 ring-blue-400/30";
      case TaskStatus.DONE:
        return "bg-green-500/10 text-green-400 ring-green-500/20";
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset",
        getTaskStatus(status),
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
