import useSWR from "swr";
import { Portal } from "@radix-ui/themes";
import { Task } from "types/task";
import { format } from "date-fns";

import fetcher from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, FileText, CalendarClock, CalendarCheck2 } from "lucide-react";
import { LoadingSpinner } from "../shared/icons";
import StatusBadge from "./statusBadge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import DeleteConfirmationDialog from "../projects/settings/confirm";

interface ProjectCreateContentProps {
  taskId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const TaskDetailModal = ({
  isOpen,
  setOpen,
  taskId,
}: ProjectCreateContentProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <Portal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              View the details of this task.
            </DialogDescription>
          </DialogHeader>
          <TaskDetailContent taskId={taskId} />
          <div className="flex w-full items-center justify-between">
            <div>
              <DeleteConfirmationDialog
                type="task"
                taskId={taskId}
                id={taskId}
                afterDelete={() => setOpen(false)}
                hasLabel={false}
              />
            </div>
            <div>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Portal>
    </Dialog>
  );
};

export default TaskDetailModal;

const TaskDetailContent = ({ taskId }: { taskId: string }) => {
  const {
    data: task,
    isLoading,
    error,
  } = useSWR<Task>(`/api/task/${taskId}`, fetcher, {
    revalidateOnFocus: true,
  });

  if (error) {
    console.error(error);
  }

  return (
    <>
      <div className="flex w-full flex-col items-start space-y-3">
        {isLoading ? (
          <div className="inline-flex w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {task?.status && (
              <div className="flex items-center space-x-2">
                <StatusBadge status={task.status} />
              </div>
            )}
            <div className="flex w-full items-start justify-between">
              <h4
                className=" 
        text-md flex items-center
        space-x-2 text-zinc-600"
              >
                <User className="text-zinc-500" size={12} />
                <span>Task Name</span>
              </h4>
              <p>{task?.name}</p>
            </div>
            {task?.startDate && (
              <div className=" flex w-full items-start justify-between">
                <h4
                  className="
                text-md flex items-center
                space-x-2 text-zinc-600"
                >
                  <CalendarClock className="text-zinc-500" size={12} />
                  <span>Start Date</span>
                </h4>
                <p>
                  {task?.startDate
                    ? format(new Date(task?.startDate), "dd/MM/yyyy")
                    : "No start date"}
                </p>{" "}
              </div>
            )}
            {task?.endDate && (
              <div className=" flex w-full items-start justify-between">
                <h4
                  className="
                text-md flex items-center
                space-x-2 text-zinc-600"
                >
                  <CalendarCheck2 className="text-zinc-500" size={12} />
                  <span>End Date</span>
                </h4>
                <p>
                  {task?.endDate
                    ? format(new Date(task?.endDate), "dd/MM/yyyy")
                    : "No end date"}
                </p>{" "}
              </div>
            )}

            <div className=" flex w-full flex-col items-start justify-between space-y-2">
              <h4
                className="
                text-md flex items-center
                space-x-2 text-zinc-600"
              >
                <FileText className="text-zinc-500" size={12} />
                <span>Description</span>
              </h4>
              <Textarea
                className="w-full"
                defaultValue={task?.description}
                disabled
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
