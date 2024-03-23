import { LoadingSpinner } from "@/components/shared/icons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import fetcher from "@/lib/fetcher";
import { Project, User } from "@prisma/client";
import { Box, Button, Dialog, ScrollArea, Text } from "@radix-ui/themes";
import { Check, CopyIcon, Inbox, Users, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface MembersListDialogProps {
  projectId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const MembersListDialog = ({
  projectId,
  isOpen,
  setOpen,
}: MembersListDialogProps) => {
  const { data: session } = useSession();
  const { data: project } = useSWR<
    Project & {
      owners: User[];
      members: User[];
      inviteCode: string;
    }
  >(`/api/project/${projectId}/member`, fetcher, {
    revalidateOnFocus: true,
  });

  if (!project) {
    return (
      <div className={"flex flex-col items-center gap-2"}>
        <LoadingSpinner />
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
        <Button color={"gray"} variant={"soft"} onClick={() => setOpen(true)}>
          <Users className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        style={{
          maxWidth: 450,
          minHeight: 400,
        }}
      >
        <Dialog.Title>Members List</Dialog.Title>
        <Dialog.Description>
          List of members in this project.
        </Dialog.Description>
        <InviteMember projectInviteCode={project.inviteCode} />
        <Box mt={"4"}>
          <Tabs defaultValue="members">
            <TabsList
              className={
                "flex w-full max-w-screen-sm items-center justify-center"
              }
            >
              <TabsTrigger className={"w-full"} value="members">
                Members
              </TabsTrigger>
              <TabsTrigger className={"w-full"} value="pendingInvites">
                Pending Invites
              </TabsTrigger>
            </TabsList>
            <TabsContent value={"members"} className="overflow-hidden">
              <ScrollArea
                type="always"
                scrollbars="vertical"
                style={{ height: '100%' }}
                >
                <div className="text-sm text-zinc-400">
                  <ul className="h-[200px] w-full list-inside list-disc pr-2">
                    {project &&
                    ((project.members && project.members.length > 0) ||
                      (project.owners && project.owners.length > 0)) ? (
                      [
                        ...(project.members || []),
                        ...(project.owners || []),
                      ].map((user) => (
                        <li
                          className="flex flex-row items-center justify-between p-3 text-sm text-zinc-500"
                          key={user.email}
                        >
                          <div className="flex flex-col items-start">
                            <span className={"text-zinc-400"}>
                              {user.name}{" "}
                              {session &&
                                session.user.email === user.email &&
                                "(You)"}
                            </span>
                            <span className={"text-zinc-500"}>
                              {user.email}
                            </span>
                          </div>
                          {session && session.user.email !== user.email && (
                            <button onClick={() => onRemoveMember(user.id)}>
                              x
                            </button>
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
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pendingInvites" style={{ height: '200px' }}>
              <PendingInvites
                code={project.inviteCode!}
                projectId={projectId}
              />
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
  role: "member" | "owner";
}

const PendingInvites = ({
  code,
  projectId,
}: {
  code: string;
  projectId: string;
}) => {
  const { data: pendingInvites } = useSWR<ProjectInviteAttempt[]>(
    `/api/project/${projectId}/member/invite`,
    fetcher,
  );

  if (!pendingInvites || pendingInvites.length === 0) {
    return (
      <div className="my-4 flex w-full flex-col items-center justify-center space-y-2">
        <Inbox className="mx-auto h-8 w-8 text-zinc-400" />
        <Text>No pending invites found.</Text>
      </div>
    );
  }

  const onAcceptInvite = async ({
    code,
    userId,
    projectId,
  }: {
    code: string;
    userId: string;
    projectId: string;
  }) => {
    try {
      const res = await fetch(`/api/project/${projectId}/member/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, userId, projectId }),
      });

      if (res.ok) {
        toast.success("You have joined the project");
        mutate(`/api/project/${projectId}/member`);
        mutate(`/api/project/${projectId}/member/invite`);
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast.error("Something went wrong!");
    }
  };

  const onDeclineInvite = async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) => {
    try {
      const res = await fetch(`/api/project/${projectId}/member/invite`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, projectId }),
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
  };

  return (
    <div className="text-sm text-zinc-400">
      <ul className="h-[200px] w-full list-inside list-disc overflow-y-auto py-4">
        {pendingInvites.map((user) => (
          <li
            className="flex flex-row items-center justify-between py-3 text-sm text-zinc-500"
            key={user.userId}
          >
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <span className={"text-zinc-400"}>{user.name}</span>
                <span className={"text-zinc-500"}>{user.email}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size={"1"}
                  color={"blue"}
                  variant={"outline"}
                  onClick={() =>
                    onAcceptInvite({
                      code: code,
                      userId: user.userId,
                      projectId,
                    })
                  }
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size={"1"}
                  color={"red"}
                  variant={"outline"}
                  onClick={() =>
                    onDeclineInvite({
                      userId: user.userId,
                      projectId,
                    })
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const InviteMember = ({ projectInviteCode }: { projectInviteCode: string }) => {
  return (
    <Box my={"4"}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
        mb={"2"}
      >
        <Input style={{ width: "100%" }} value={projectInviteCode} disabled />
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
          <CopyIcon size={18} color={"#fff"} />
        </Button>
      </Box>
      <Text
        as={"span"}
        style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)" }}
      >
        Share this invite code with others to join this project.
      </Text>
    </Box>
  );
};