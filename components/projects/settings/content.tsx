import {Field, Form, Formik} from "formik";
import {toast} from "sonner";
import useSWR, {mutate} from "swr";
import {Label} from "@/components/ui/label";
import fetcher from "@/lib/fetcher";
import {Project, ProjectStatus} from "types/project";
import {LoadingSpinner} from "@/components/shared/icons";
import DeleteConfirmationDialog from "./confirm";
import {MembersDialog} from "./members";
import {useSession} from "next-auth/react";
import {Button, Flex, Switch, TextArea, TextField} from "@radix-ui/themes";

const ProjectSettingsContent = ({projectId}: { projectId: string }) => {
    const {data: session} = useSession();
    const {data: project, isValidating} = useSWR<Project>(
        `/api/project/${projectId}`,
        fetcher,
        {
            revalidateOnFocus: false,
        },
    );

    const isOwner = project?.owner.id === session?.user?.id;

    if (isValidating || !project) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <>
            {isOwner && (
                <div>
                    <RenameProjectForm id={projectId} name={project?.name}/>
                    <ProjectDescriptionForm
                        id={projectId}
                        description={project?.description}
                    />
                    <MembersDialog projectId={projectId}/>
                    <ProjectStatusForm id={projectId} status={project?.status}/>
                    <ProjectDeleteForm id={projectId}/>
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
            <Formik initialValues={{name: name || ""}} onSubmit={onSubmit}>
                {({isSubmitting, submitForm}) => (
                    <Form>
                        <div className="grid grid-cols-3 items-end gap-4 py-6">
                            <div className="col-span-2 flex flex-col justify-end space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Field as={TextField.Input} name="name" type="text" className="w-full" color={'lime'}/>
                            </div>
                            <div className="col-span-1">

                                <Button
                                    size={'2'}
                                    variant={'outline'}
                                    color={'lime'}
                                    style={{width: "100%"}}
                                    onClick={() => submitForm()}
                                >
                                    Rename
                                </Button>

                            </div>
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
                initialValues={{description: description || ""}}
                onSubmit={onSubmit}
            >
                {({isSubmitting, submitForm}) => (
                    <Form>
                        <div className="flex flex-col space-x-4 py-6">
                            <div className="flex flex-col items-start space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Field as={TextArea} name="description"
                                       color={'lime'}
                                       size={'3'}
                                       style={{
                                           width: "100%",
                                       }}
                                />
                                <Flex
                                    align="center"
                                    justify="end"
                                    width="100%"
                                >
                                    <Button
                                        variant={'outline'}
                                        color={'lime'}
                                        style={{width: "30%"}}
                                        onClick={() => submitForm()}
                                    >
                                        Update
                                    </Button>
                                </Flex>
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
    const onChange = async (status: ProjectStatus) => {
        try {
            toast.loading("Updating project status...");

            const res = await fetcher(`/api/project/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({status}),
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
                            color={'lime'}
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

const ProjectDeleteForm = ({id}: { id: string }) => {
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
                        <DeleteConfirmationDialog hasLabel={true} id={id}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
