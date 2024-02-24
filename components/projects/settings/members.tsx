import useSWR, {mutate} from "swr";
import {Box, Button, Dialog, Portal, Text} from "@radix-ui/themes";
import {toast} from "sonner";
import {CopyIcon} from "lucide-react";

import fetcher from "@/lib/fetcher";
import {Project, User} from "@prisma/client";
import {Input} from "@/components/ui/input";
import {LoadingSpinner} from "@/components/shared/icons";
import {isUserOwner} from "@/lib/utils";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

export const MembersDialog = ({user, projectId}: {
    user: Session, projectId: string
}) => {
    const {data: project, isValidating} = useSWR<Project & { owners: User[], members: User[] }>(
        `/api/project/${projectId}`,
        fetcher,
        {
            revalidateOnFocus: false,
        },
    );

    if (isValidating || !project) {
        return null;
    }

    const isOwner = isUserOwner(project.owners, user.user.email)

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <div className="my-8 bg-zinc-800 sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-zinc-400">
                            Add Member
                        </h3>
                        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                            <div className="max-w-xl text-sm text-gray-500">
                                <p>
                                    Add a member to this project. You can add or remove members
                                    from the project at any time.
                                </p>
                            </div>
                            <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                                <Button color={"lime"} variant={"outline"}>
                                    Add Member
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Content style={{maxWidth: 450}}>
                    <Dialog.Title>Members List</Dialog.Title>
                    <Dialog.Description>
                        List of members in this project.
                    </Dialog.Description>
                    <MembersList projectId={projectId}/>
                    <InviteMember projectInviteCode={project.inviteCode || ''}/>
                </Dialog.Content>
            </Portal>
        </Dialog.Root>
    );
};

const MembersList = ({projectId}: { projectId: string }) => {
    const {data: session} = useSession();
    const {data: project} = useSWR<Project & {
        owners: User[],
        members: User[]
    }>(`/api/project/${projectId}/member`, fetcher, {
        revalidateOnFocus: true,
    });

    if (!project) {
        return (
            <div className={"flex flex-col items-center gap-2"}>
                <LoadingSpinner/>
            </div>
        );
    }

    const onRemoveMember = async (userId: string) => {
        try {
            const data = await fetcher(`/api/project/${projectId}/member`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            });

            if (data && data.message === "Member deleted successfully") {
                toast.success("Member removed successfully!");

                mutate(`/api/project/${projectId}`);
            } else {
                // If the response is not OK, show an error toast with the message from the server
                toast.error(data.error || "Something went wrong!");
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Error removing member:", error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="w-full px-4 py-2 sm:p-6">
            <div className="border-t border-zinc-600"></div>

            <div className="text-sm text-zinc-400">
                <ul className="h-[200px] w-full list-inside list-disc overflow-y-auto py-4">
                    {project && ((project.members && project.members.length > 0) || (project.owners && project.owners.length > 0)) ? (
                        [...(project.members || []), ...(project.owners || [])].map((user) => (
                            <li
                                className="flex flex-row items-center justify-between py-3 text-sm text-zinc-500"
                                key={user.email}
                            >
                                <div className="flex flex-col items-start">
                                    <span className={"text-zinc-400"}>{user.name} {
                                        session && session.user.email === user.email && '(You)'
                                    }</span>
                                    <span className={"text-zinc-500"}>{user.email}</span>
                                </div>
                                {session && session.user.email !== user.email && (
                                    <button onClick={() => onRemoveMember(user.id)}>x</button>
                                )}
                            </li>
                        ))
                    ) : (
                        <li
                            key="no-members-found" // Use a unique key for the case when no members are found
                            className="text-center text-sm text-zinc-400 "
                        >
                            No members found.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

const InviteMember = ({projectInviteCode}: { projectInviteCode: string }) => {

    return (
        <Box>
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                }}
                mb={'2'}
            >
                <Input style={{width: "100%"}} value={projectInviteCode} disabled/>
                <Button
                    color={"gray"}
                    radius={"medium"}
                    variant="surface"
                    onClick={() => {
                        navigator.clipboard.writeText(projectInviteCode);
                        toast.success("Invite code copied to clipboard!");
                    }}
                    aria-label="Copy invite code to clipboard"
                >
                    <CopyIcon size={18} color={"#fff"}/>
                </Button>
            </Box>
            <Text as={"span"}
                  style={{fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)" }}
            >
                Share this invite code with others to join this project.
            </Text>
        </Box>
    );
};
