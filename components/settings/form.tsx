import {useRouter} from "next/router";
import {ErrorMessage, Field, Form, Formik} from "formik";
import useSWR, {mutate} from "swr";
import {User} from "@prisma/client";
import {Button} from "@radix-ui/themes";
import fetcher from "@/lib/fetcher";

import * as Yup from "yup";

import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {toast} from "sonner";
import {LoadingSpinner} from "../shared/icons";

interface FormValues {
    name: string;
}

// data comes from SWR -> data.user.userInfo
// this is the type of data.user.userInfo
type UserInfos = {
    user: User;
};

const SettingsForm = () => {
    const router = useRouter();
    const {data} = useSWR<UserInfos>("/api/user", fetcher);
    const {user} = data || {};

    const initialValues: FormValues = {
        name: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().min(3).nullable(),
    });

    const handleSubmit = async (values: FormValues) => {
        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                toast.success("Profile updated successfully");
                mutate("/api/auth/session", true);
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        }
    };

    if (!user) {
        return <LoadingSpinner/>;
    }

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, submitForm}) => (
                    <Form>
                        <div className="my-2">
                            <Label htmlFor="name">Name</Label>
                            <Field
                                as={Input}
                                name="name"
                                placeholder={user.name}
                                type="text"
                            />
                            <ErrorMessage
                                name="name"
                                className="py-1 text-xs italic text-red-500"
                                component="div"
                            />
                        </div>
                        <Button
                            color={'lime'}
                            type="submit"
                            onClick={submitForm}
                            disabled={isSubmitting}
                            style={{width: '100%'}}
                        >
                            {isSubmitting ? <LoadingSpinner/> : "Save"}
                        </Button>
                    </Form>
                )}
            </Formik>

            <div className="mt-4">
                <Button
                    color={'red'}
                    variant={"surface"}
                    style={{width: '100%'}}
                    onClick={() => {
                        // TODO: add a confirmation modal
                        if (confirm("Are you sure you want to delete your account?")) {
                            fetch("/api/user", {
                                method: "DELETE",
                            })
                                .then((res) => {
                                    if (res.ok) {
                                        toast.success("Account deleted successfully");
                                        router.push("/");
                                    }
                                })
                                .catch((error) => {
                                    toast.error(error.message || "An error occurred");
                                });
                        }
                    }}
                >
                    Delete Account
                </Button>
            </div>
        </div>
    );
};

export default SettingsForm;
