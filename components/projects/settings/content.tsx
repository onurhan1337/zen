import { LoadingSpinner } from "@/components/shared/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fetcher from "@/lib/fetcher";
import { isUserOwner } from "@/lib/utils";
import { Button, Switch, TextArea, TextField } from "@radix-ui/themes";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { Project, ProjectStatus } from "types/project";
import DeleteConfirmationDialog from "./confirm";
import { MembersDialog } from "./members";

const ProjectSettingsContent = ({ projectId }: { projectId: string }) => {
  const { data: session } = useSession();
  const { data: project, isValidating } = useSWR<Project>(
    `/api/project/${projectId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const isOwner = project ? isUserOwner(project.owners, session) : false;

  if (isValidating || !project) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {isOwner && (
        <div className="space-y-6">
          <RenameProjectForm id={projectId} name={project?.name} />
          <ProjectDescriptionForm
            id={projectId}
            description={project?.description}
          />
          <MembersDialog projectId={projectId} user={session!} />
          <ProjectStatusForm id={projectId} status={project?.status} />
          <ProjectDeleteForm id={projectId} />
        </div>
      )}
    </>
  );
};

export default ProjectSettingsContent;

const RenameProjectForm = ({
  id,
  name,
}: {
  id: string;
  name: string | undefined;
}) => {
  const onSubmit = async (values: { name: string }) => {
    try {
      const res = await fetcher(`/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res) {
        toast.success("Project renamed successfully!");
        mutate(`/api/project/${id}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="Rename">
        <AccordionTrigger>
          <div>
            <h3>Rename Project</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Formik initialValues={{ name: name || "" }} onSubmit={onSubmit}>
            {({ submitForm }) => (
              <Form>
                <div className="flex w-full flex-col justify-center space-y-4">
                  <Field
                    as={TextField.Input}
                    name="name"
                    type="text"
                    color={"blue"}
                  />
                  <Button
                    size={"2"}
                    variant={"outline"}
                    color={"blue"}
                    onClick={() => submitForm()}
                  >
                    Rename
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </AccordionContent>{" "}
      </AccordionItem>
    </Accordion>
  );
};

const ProjectDescriptionForm = ({
  id,
  description,
}: {
  id: string;

  description: string | undefined;
}) => {
  const onSubmit = async (values: { description: string }) => {
    try {
      const res = await fetcher(`/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res) {
        toast.success("Project details updated successfully!");
        mutate(`/api/project/${id}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="Description">
        <AccordionTrigger>
          <div>
            <h3>Project Description</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Formik
            initialValues={{ description: description || "" }}
            onSubmit={onSubmit}
          >
            {({ submitForm }) => (
              <Form>
                <div className="flex flex-col space-y-4">
                  <Field
                    as={TextArea}
                    name="description"
                    color={"blue"}
                    size={"3"}
                  />
                  <Button
                    variant={"outline"}
                    color={"blue"}
                    onClick={() => submitForm()}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ProjectStatusForm = ({
  id,
  status,
}: {
  id: string;
  status: ProjectStatus | undefined;
}) => {
  const onChange = async (status: ProjectStatus) => {
    try {
      const res = await fetcher(`/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res) {
        toast.success("Project status updated successfully!");
        mutate(`/api/project/${id}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  if (!status) return null;

  return (
    <div className="bg-zinc-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-zinc-400">
          Project Status
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-zinc-500">
            <p>
              Status of the project. If the project is archived, it will not be
              visible to other users. You can activate it again later.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <Switch
              color={"blue"}
              checked={status === "active"}
              onCheckedChange={(checked) =>
                onChange(
                  checked ? ProjectStatus.ACTIVE : ProjectStatus.ARCHIVED,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDeleteForm = ({ id }: { id: string }) => {
  return (
    <div className="my-6 bg-zinc-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-zinc-400">
          Delete Project
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-zinc-500">
            <p>
              Once you delete a project, there is no going back. Please be
              certain.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <DeleteConfirmationDialog hasLabel={true} id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};
