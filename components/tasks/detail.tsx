import useSWR from "swr";
import {format} from "date-fns";
import {Box, Button, Dialog, Flex} from "@radix-ui/themes";
import {CalendarCheck2, CalendarClock, FastForward, FileText, User,} from "lucide-react";

import {Task} from "types/task";
import fetcher from "@/lib/fetcher";
import {LoadingSpinner} from "../shared/icons";
import StatusBadge from "./statusBadge";
import {Textarea} from "../ui/textarea";
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
        <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => setOpen(open)}>
            <Dialog.Content
                style={{maxWidth: 450}}
            >
                <Dialog.Title>Task Details</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    View the details of this task.
                </Dialog.Description>
                <Box
                    style={{gap: 3}}
                >
                    <TaskDetailContent taskId={taskId}/>
                </Box>
                <Flex
                    width={"100%"}
                    align="center"
                    justify="between"
                    mt={'4'}
                >
                    <div>
                        <DeleteConfirmationDialog
                            type="task"
                            taskId={taskId}
                            id={taskId}
                            afterDelete={() => setOpen(false)}
                            hasLabel={false}
                        />
                    </div>
                    <Box>
                        <Button
                            size={'2'}
                            color={'gray'}
                            radius={'full'}
                            onClick={() => setOpen(false)}
                        >Close</Button>
                    </Box>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default TaskDetailModal;

const TaskDetailContent = ({taskId}: { taskId: string }) => {
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
            <Flex
                width={"100%"}
                direction="column"
                align="start"

                className="flex w-full flex-col items-start space-y-3">
                {isLoading ? (
                    <div className="inline-flex w-full items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        {task?.status && (
                            <div className="flex items-center space-x-2">
                                <StatusBadge status={task.status}/>
                            </div>
                        )}
                        <div className="flex w-full items-start justify-between">
                            <h4
                                className="
        text-md flex items-center
        space-x-2 text-zinc-600"
                            >
                                <User className="text-zinc-400" size={12}/>
                                <span className={'text-zinc-400'}>Task Name</span>
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
                                    <CalendarClock className="text-zinc-400" size={12}/>
                                    <span className={'text-zinc-400'}>Start Date</span>
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
                                    <CalendarCheck2 className="text-zinc-400" size={12}/>
                                    <span className={'text-zinc-400'}>End Date</span>
                                </h4>
                                <p>
                                    {task?.endDate
                                        ? format(new Date(task?.endDate), "dd/MM/yyyy")
                                        : "No end date"}
                                </p>{" "}
                            </div>
                        )}

                        <div className=" flex w-full items-start justify-between">
                            <h4
                                className="
                text-md flex items-center
                space-x-2 text-zinc-600"
                            >
                                <FastForward className="text-zinc-400" size={12}/>
                                <span className={'text-zinc-400'}>Priority</span>
                            </h4>
                            <p className="rounded-full bg-zinc-600 px-2 py-1 text-xs font-medium uppercase tracking-tight text-zinc-400">
                                {task?.priority.toUpperCase()}
                            </p>
                        </div>

                        {task?.assignee && (
                            <div className=" flex w-full items-start justify-between">
                                <h4
                                    className="
                            text-md flex items-center
                            space-x-2 text-zinc-600"
                                >
                                    <FastForward className="text-zinc-400" size={12}/>
                                    <span className={'text-zinc-400'}>Assigned to</span>
                                </h4>
                                <p className="rounded-full bg-zinc-600 px-2 py-1 text-xs font-medium uppercase tracking-tight text-zinc-400">
                                    {task?.assignee.name}
                                </p>
                            </div>
                        )}

                        <div className=" flex w-full flex-col items-start justify-between space-y-2">
                            <h4
                                className="
                text-md flex items-center
                space-x-2 text-zinc-600"
                            >
                                <FileText className="text-zinc-400" size={12}/>
                                <span className={'text-zinc-400'}>Description</span>
                            </h4>
                            <Textarea
                                className="w-full"
                                defaultValue={task?.description}
                                disabled
                            />
                        </div>
                    </>
                )}
            </Flex>
        </>
    );
};
