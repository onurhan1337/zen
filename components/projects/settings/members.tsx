import { Box, Button, Dialog, Portal, Text } from "@radix-ui/themes";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";

import { Input } from "@/components/ui/input";
import fetcher from "@/lib/fetcher";
import { Project, User } from "@prisma/client";
import { Session } from "next-auth";

export const MembersDialog = ({
  user,
  projectId,
}: {
  user: Session;
  projectId: string;
}) => {
  const { data: project, isValidating } = useSWR<
    Project & { owners: User[]; members: User[] }
  >(`/api/project/${projectId}`, fetcher, {
    revalidateOnFocus: false,
  });

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
                <Button color={"blue"} variant={"outline"}>
                  Add Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Add Member</Dialog.Title>
          <Dialog.Description>
            Add a member to this project. You can add or remove members from the
            project at any time.
          </Dialog.Description>
          <InviteMember projectInviteCode={project.inviteCode || ""} />
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
};

const InviteMember = ({ projectInviteCode }: { projectInviteCode: string }) => {
  return (
    <Box mt={"8"}>
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
