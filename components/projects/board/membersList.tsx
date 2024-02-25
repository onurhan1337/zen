import {Box, Button, Dialog, Text} from '@radix-ui/themes';
import {useSession} from "next-auth/react";
import useSWR, {mutate} from "swr";
import {Project, User} from "@prisma/client";
import fetcher from "@/lib/fetcher";
import {LoadingSpinner} from "@/components/shared/icons";
import {toast} from "sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Check, Inbox, X} from "lucide-react";

interface MembersListDialogProps {
    projectId: string;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

const MembersListDialog = ({projectId, isOpen, setOpen}: MembersListDialogProps) => {
    const {data: session} = useSession();
    const {data: project} = useSWR<Project & {
        owners: User[],
        members: User[],
        inviteCode: string,
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

                mutate(`/api/project/${projectId}/member`);
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
        <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => setOpen(open)}>
            <Dialog.Trigger>
                <Button
                    color={'gray'}
                    variant={'outline'}
                    onClick={() => setOpen(true)}>
                    Members
                </Button>
            </Dialog.Trigger>
            <Dialog.Content
                style={{maxWidth: 450}}
            >
                <Dialog.Title>
                    Members List
                </Dialog.Title>
                <Dialog.Description>
                    List of members in this project.
                </Dialog.Description>
                <Box mt={'4'}>
                    <Tabs defaultValue="members"
                    >
                        <TabsList className={'flex w-full max-w-screen-sm items-center justify-center'}>
                            <TabsTrigger className={'w-full'} value="members">
                                Members
                            </TabsTrigger>
                            <TabsTrigger className={'w-full'} value="pendingInvites">
                                Pending Invites
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={'members'}>
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
                                            key="no-members-found"
                                            className="text-center text-sm text-zinc-400 "
                                        >
                                            No members found.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="pendingInvites">
                            <PendingInvites code={project.inviteCode!} projectId={projectId}/>
                        </TabsContent>
                    </Tabs>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default MembersListDialog;

interface ProjectInviteAttempt {
    id: string;
    name: string;
    email: string;
    userId: string;
    projectId: string;
    expires: Date | null;
    role: 'member' | 'owner';
}

const PendingInvites = ({code, projectId}: {code: string, projectId: string; }) => {
    const {data: pendingInvites} = useSWR<ProjectInviteAttempt[]>(`/api/project/${projectId}/member/invite`, fetcher);

    if (!pendingInvites || pendingInvites.length === 0) {
        return (
            <div className="flex w-full flex-col items-center justify-center space-y-2 my-4">
                <Inbox className="mx-auto h-8 w-8 text-zinc-400"/>
                <Text>No pending invites found.</Text>
            </div>
        );
    }

    const onAcceptInvite = async ({code, userId, projectId,}: {
        code: string;
        userId: string;
        projectId: string;
    }) => {
        try {
            const res = await fetch(`/api/project/${projectId}/member/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({code, userId, projectId})
            });

            if (res.ok) {
                toast.success("You have joined the project");
                mutate(`/api/project/${projectId}/member/invite`);
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (error) {
            console.error("Error accepting invite:", error);
            toast.error("Something went wrong!");
        }
    }

    const onDeclineInvite = async ({userId, projectId,}: {
        userId: string;
        projectId: string;
    }) => {
        try {
            const res = await fetch(`/api/project/${projectId}/member/invite`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId, projectId})
            });

            if (res.ok) {
                toast.success("Invite declined");
                mutate(`/api/project/${projectId}/member/invite`);
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (error) {
            console.error("Error declining invite:", error);
            toast.error("Something went wrong!");
        }

    }

    return (
        <div className="text-sm text-zinc-400">
            <ul className="h-[200px] w-full list-inside list-disc overflow-y-auto py-4">
                {pendingInvites.map((user) => (
                    <li
                        className="flex flex-row items-center justify-between py-3 text-sm text-zinc-500"
                        key={user.userId}
                    >
                        <div className="w-full flex flex-row items-center justify-between">
                            <div
                                className="flex flex-col items-start"
                            >
                                <span className={"text-zinc-400"}>{user.name}</span>
                                <span className={"text-zinc-500"}>{user.email}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size={'1'}
                                    color={'lime'}
                                    variant={'outline'}
                                    onClick={() => onAcceptInvite({
                                        code: code,
                                        userId: user.userId,
                                        projectId,
                                    })}
                                >
                                    <Check className="h-4 w-4"/>
                                </Button>
                                <Button
                                    size={'1'}
                                    color={'red'}
                                    variant={'outline'}
                                    onClick={() => onDeclineInvite({
                                        userId: user.userId,
                                        projectId,
                                    })
                                        }
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
