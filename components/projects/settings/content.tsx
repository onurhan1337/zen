import { Field, Form, Formik } from "formik";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import SubmitButton from "@/components/shared/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fetcher from "@/lib/fetcher";
import { Project, ProjectStatus, ProjectStatusType } from "types/project";
import { LoadingSpinner } from "@/components/shared/icons";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import DeleteConfirmationDialog from "./confirm";

const ProjectSettingsContent = ({ projectId }: { projectId: string }) => {
  const { data: project, isValidating } = useSWR<Project>(
    `/api/project/${projectId}`,
    fetcher,
    {
      revalidateOnFocus: true,
    },
  );

  return (
    <div>
      {isValidating ? (
        <LoadingSpinner />
      ) : (
        <div>
          <RenameProjectForm id={projectId} name={project?.name} />
          <ProjectDescriptionForm
            id={projectId}
            description={project?.description}
          />
          <ProjectStatusForm id={projectId} status={project?.status} />
          <ProjectDeleteForm id={projectId} />
        </div>
      )}
    </div>
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
      toast.loading("Renaming project...");

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
    <div>
      <Formik initialValues={{ name: name || "" }} onSubmit={onSubmit}>
        {({ isSubmitting, submitForm }) => (
          <Form>
            <div className="flex flex-row items-end space-x-4 py-6">
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Field as={Input} name="name" type="text" className="w-72" />
              </div>
              <SubmitButton
                label="Rename"
                isSubmitting={isSubmitting}
                submitForm={submitForm}
                showShortcutIcons={false}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
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
      toast.loading("Updating project details...");

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
    <div>
      <Formik
        initialValues={{ description: description || "" }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, submitForm }) => (
          <Form>
            <div className="flex flex-col space-x-4 py-6">
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field as={Textarea} name="description" rows={5} />
                <SubmitButton
                  label="Update"
                  isSubmitting={isSubmitting}
                  submitForm={submitForm}
                  showShortcutIcons={false}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const ProjectStatusForm = ({
  id,
  status,
}: {
  id: string;
  status: ProjectStatus | undefined;
}) => {
  const onSubmit = async (values: { status: ProjectStatus }) => {
    try {
      toast.loading("Updating project status...");

      const res = await fetcher(`/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res) {
        toast.success("Project status updated successfully!");
        mutate(`/api/project/${id}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ status: status || ProjectStatus.ACTIVE }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, submitForm }) => (
          <Form>
            <div className="flex flex-row items-end space-x-4 py-6">
              <div className="flex flex-col items-start space-y-2">
                <div className="relative col-span-2 mt-2 md:col-span-1">
                  <Label htmlFor="status">Status</Label>
                  <Field
                    as={Select}
                    name="status"
                    id="status"
                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                    defaultValue={status}
                    onValueChange={(value: ProjectStatus) =>
                      setFieldValue("status", value)
                    }
                  >
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectStatus.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={ProjectStatus.INACTIVE}>
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Field>
                </div>
              </div>
              <SubmitButton
                label="Update"
                isSubmitting={isSubmitting}
                submitForm={submitForm}
                showShortcutIcons={false}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const ProjectDeleteForm = ({ id }: { id: string }) => {
  return (
    <div className="py-6">
      <DeleteConfirmationDialog hasLabel={true} id={id} />
    </div>
  );
};
