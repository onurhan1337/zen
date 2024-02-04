import useSWR, {mutate} from "swr";
import {Field, Form, Formik} from "formik";
import {Box, Button, Dialog, Portal, TextField} from "@radix-ui/themes";
import {toast} from "sonner";
import * as Yup from "yup";

import fetcher from "@/lib/fetcher";
import {Project} from "types/project";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LoadingSpinner} from "@/components/shared/icons";

export const MembersDialog = ({projectId}: { projectId: string }) => {
    const {data: project, isValidating} = useSWR<Project>(
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
                        <h3 className="text-lg font-medium leading-6 text-zinc-400"
                        >
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
                                <Button color={'lime'} variant={'outline'}>Add Member</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Content
                    style={{maxWidth: 450}}
                >
                    <Dialog.Title>Members List</Dialog.Title>
                    <Dialog.Description>
                        List of members in this project.
                    </Dialog.Description>
                    <div className="py-2">
                        {project.owner && (
                            <h6
                                className="flex flex-col text-sm"
                                key={project.owner.id}
                            >
                                <span className={'text-zinc-300'}>{project.owner.name} (Owner)</span>
                                <span className={'text-zinc-400'}>{project.owner.email}</span>
                            </h6>
                        )}
                    </div>
                    <MembersList projectId={projectId}
                    />
                    <AddMemberForm projectId={projectId}/>
                </Dialog.Content>
            </Portal>
        </Dialog.Root>
    );
};

const MembersList = ({projectId}: { projectId: string }) => {
    const {data: members} = useSWR<
        { id: string; email: string; name: string }[]
    >(`/api/project/${projectId}/member`, fetcher, {
        revalidateOnFocus: true,
    });

    if (!members) {
        return (
            <div className={'flex flex-col items-center gap-2'}>
                <LoadingSpinner/>
            </div>
        )
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
                                    <span className={'text-zinc-400'}>{member.name}</span>
                                    <span className={'text-zinc-500'}>{member.email}</span>
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

const AddMemberForm = ({projectId}: { projectId: string }) => {
    const onSubmit = async (
        values: {
            email: string;
        },
        {
            setSubmitting,
            setErrors,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            setErrors: (errors: { submit?: string }) => void;
        },
    ) => {
        try {
            const response = await fetch(`/api/project/${projectId}/member`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Email sent with Resend to email confirmation link");
            }
        } catch (error) {
            setErrors({submit: "There was an error. Please try again."});
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{email: ""}}
            validationSchema={Yup.object({
                email: Yup.string().email("Invalid email address").required("Required"),
            })}
            onSubmit={onSubmit}
        >
            {({errors}) => (
                <Form>
                    <div className="z-50 flex flex-col gap-2 py-4">
                        <Label htmlFor="email">Email</Label>
                        <Field
                            as={TextField.Input}
                            name="email"
                            color={'lime'}
                            type="email"
                            width="100%"
                            autoComplete="off"
                        />
                        <p className="text-[0.8rem] text-zinc-500">
                            User will receive an invitation to join the project.
                        </p>
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <Box
                        className="flex justify-end gap-2 py-2"
                    >
                        <Dialog.Close>
                            <Button color={'gray'} variant={'surface'} radius={'full'}
                            >Cancel</Button>
                        </Dialog.Close>
                        <Button
                            type="submit"
                            color={'lime'}
                            radius={'full'}
                            aria-label="Invite"
                        >
                            Invite
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};
