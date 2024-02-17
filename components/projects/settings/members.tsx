import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Box, Button, Dialog, Portal, Tooltip } from "@radix-ui/themes";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import fetcher from "@/lib/fetcher";
import { Project } from "types/project";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/icons";

export const MembersDialog = ({ projectId }: { projectId: string }) => {
  const { data: project, isValidating } = useSWR<Project>(
    `/api/project/${projectId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (isValidating || !project) {
    return null;
  }

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
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Members List</Dialog.Title>
          <Dialog.Description>
            List of members in this project.
          </Dialog.Description>
          <div className="py-2">
            {project.owner && (
              <h6 className="flex flex-col text-sm" key={project.owner.id}>
                <span className={"text-zinc-300"}>
                  {project.owner.name} (Owner)
                </span>
                <span className={"text-zinc-400"}>{project.owner.email}</span>
              </h6>
            )}
          </div>
          <MembersList projectId={projectId} />
          <InviteMember projectId={projectId} />
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
};

const MembersList = ({ projectId }: { projectId: string }) => {
  const { data: members } = useSWR<
    { id: string; email: string; name: string }[]
  >(`/api/project/${projectId}/member`, fetcher, {
    revalidateOnFocus: true,
  });

  if (!members) {
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
          {members && members.length > 0 ? (
            members.map((member) => (
              <li
                className="flex flex-row items-center justify-between py-3 text-sm text-zinc-500"
                key={member.email}
              >
                <div className="flex flex-col items-start">
                  <span className={"text-zinc-400"}>{member.name}</span>
                  <span className={"text-zinc-500"}>{member.email}</span>
                </div>
                <button onClick={() => onRemoveMember(member.id)}>x</button>
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

const InviteMember = ({ projectId }: { projectId: string }) => {
  const [inviteCode, setInviteCode] = useState<string>("");

  const handleGenerateInviteCode = async () => {
    try {
      const data = await fetcher(`/api/project/${projectId}/member/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data && data.inviteCode) {
        setInviteCode(data.inviteCode);
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error generating invite code:", error);
      toast.error("Something went wrong!");
    }
  };

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
      >
        <Input style={{ width: "100%" }} value={inviteCode} disabled />
        <Button
          color={"gray"}
          radius={"medium"}
          variant="surface"
          onClick={() => {
            navigator.clipboard.writeText(inviteCode);
            toast.success("Invite code copied to clipboard!");
          }}
          aria-label="Copy invite code to clipboard"
        >
          <CopyIcon size={18} color={"#fff"} />
        </Button>
      </Box>
      <Tooltip
        content="Generate an invite code to share with others to join this project. Users can join the project by entering the invite code. Before sharing the invite code, make sure to user has logged in."
        style={{
          maxWidth: "200px",
          padding: "8px",
          fontSize: "12px",
          textAlign: "center",
          borderRadius: "4px",
        }}
      >
        <Button
          color={"lime"}
          radius={"full"}
          variant={"surface"}
          style={{
            marginTop: "8px",
          }}
          onClick={handleGenerateInviteCode}
        >
          Generate Invite Code
        </Button>
      </Tooltip>
    </Box>
  );
};
