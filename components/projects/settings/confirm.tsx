import {useState} from "react";
import {mutate} from "swr";
import {toast} from "sonner";
import {TrashIcon} from "lucide-react";

import {Task} from "types/task";
import {Project} from "types/project";
import {AlertDialog, Button, Flex} from "@radix-ui/themes";
import {LoadingDots} from "@/components/shared/icons";
import {useRouter} from "next/router";

interface ProjectCreateContentProps {
    id: string;
    hasLabel: boolean;
    type?: "project" | "task";
    taskId?: string;
    afterDelete?: () => void;
}

const DeleteConfirmationDialog = ({
                                      id,
                                      afterDelete,
                                      hasLabel = false,
                                      type = "project",
                                      taskId,
                                  }: ProjectCreateContentProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onDeleteProject = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/project/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id}),
            });

            setOpen(false);

            if (hasLabel && res.ok) {
                router.push("/projects");
            }

            if (!res.ok) {
                throw new Error("Failed to delete the project");
            }

            mutate(
                "/api/project",
                (data: Project[] | undefined) => {
                    if (Array.isArray(data)) {
                        const updatedData = data.filter((project) => project.id !== id);
                        return updatedData;
                    }

                    return data; // Return unchanged if data is not an array
                },
                true, // Revalidate the data
            );

            toast.success("Project deleted successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const onDeleteTask = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/task/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id}),
            });

            mutate(
                `/api/project/${router.query.id}/task`,
                (data: Task[] | undefined) => {
                    if (Array.isArray(data)) {
                        const updatedData = data.filter((project) => project.id !== id);
                        return updatedData;
                    }

                    return data; // Return unchanged if data is not an array
                },
                true, // Revalidate the data
            );

            setOpen(false);

            if (afterDelete) {
                afterDelete();
            }

            if (!res.ok) {
                throw new Error("Failed to delete the project");
            }
            // ...
        } catch (error) {
            // handle error
        }
    };
    return (
        <AlertDialog.Root
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        >
            <AlertDialog.Trigger>
                {hasLabel ? (
                    <Button
                        variant={'outline'}
                        color={'red'}
                        className="w-full">
                        Delete this Project
                    </Button>
                ) : (
                    <Button variant={'ghost'} color={'red'} radius={'full'}>
                        <span className={'px-0.5 py-1'}>
                            <TrashIcon size={16}/>
                        </span>
                    </Button>
                )}
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Are you sure absolutely sure?</AlertDialog.Title>
                    <AlertDialog.Description size={'2'}>
                        This action cannot be undone. This will permanently delete the
                        project.
                    </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" radius={'full'}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <Button
                        onClick={
                            type === "project"
                                ? onDeleteProject
                                : taskId
                                    ? () => onDeleteTask(taskId)
                                    : () => {
                                    }
                        }
                        color={"red"}
                        radius={"full"}
                        disabled={loading}
                    >
                        {loading ? <LoadingDots color="#FFFFFF"/> : "Delete"}
                    </Button>
                </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default DeleteConfirmationDialog;
