import { Portal } from "@radix-ui/themes";
import { Combobox } from "@/components/shared/combobox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "types/project";
import fetcher from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import { Form, Formik } from "formik";
import { toast } from "sonner";

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
    <Dialog>
      <DialogTrigger asChild>
        <div className="my-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
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
                <Button variant={"action"}>Add Member</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <Portal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Members List</DialogTitle>
            <DialogDescription>
              List of members in this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {project.owner && (
              <h6
                className="flex flex-col text-sm text-gray-500 "
                key={project.owner.id}
              >
                <span>{project.owner.name} (Owner)</span>
                <span>{project.owner.email}</span>
              </h6>
            )}
          </div>
          <MembersList projectId={projectId} />
          <AddMemberForm projectId={projectId} />
        </DialogContent>
      </Portal>
    </Dialog>
  );
};

const AddMemberForm = ({ projectId }: { projectId: string }) => {
  const { data: users } = useSWR<{ id: string; name: string; image: string }[]>(
    "/api/users",
    fetcher,
  );

  if (!users) {
    return null;
  }

  const onSubmit = async (values: { userId: string }) => {
    try {
      const response = await fetcher(`/api/project/${projectId}/member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: values.userId,
          projectId,
        }),
      });

      if (response.ok) {
        toast.success("Member added successfully!");

        mutate(`/api/project/${projectId}`);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Formik initialValues={{ userId: "" }} onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <div className="z-50 flex flex-col gap-4 py-6">
            <Combobox
              onChange={(value: string) => {
                setFieldValue("userId", value);
              }}
              options={users.map((user) => ({
                value: user.id,
                label: user.name,
                image: user.image,
              }))}
            />
          </div>
          <DialogFooter>
            <Button variant="action" type="submit">
              Add Member
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
};

const MembersList = ({ projectId }: { projectId: string }) => {
  const { data: members } = useSWR<
    { id: string; email: string; name: string }[]
  >(`/api/project/${projectId}/member`, fetcher);

  if (!members) {
    return null;
  }

  return (
    <div className="w-full px-4 py-2 sm:p-6">
      <div className="border-t border-gray-200"></div>

      <div className="mt-2 text-sm text-gray-500">
        <ul className="h-[200px] w-full overflow-y-auto py-4">
          {members && members.length > 0 ? (
            members.map((member) => (
              <li
                className="flex flex-col text-sm text-gray-500 "
                key={member.id}
              >
                <span>{member.name}</span>
                <span>{member.email}</span>
              </li>
            ))
          ) : (
            <li className="text-center text-sm text-gray-500 ">
              No members found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
