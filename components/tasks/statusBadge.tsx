import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  function getTaskStatus(status: string) {
    switch (status) {
      case "backlog":
        return "bg-gray-400/10 text-gray-400 ring-gray-400/20";
      case "todo":
        return "bg-yellow-400/10 text-yellow-500 ring-yellow-400/20";
      case "in progress":
        return "bg-blue-400/10 text-blue-400 ring-blue-400/30";
      case "done":
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
