import { useRouter } from "next/router";
import { Form, Formik, Field, ErrorMessage } from "formik";
import useSWR from "swr";
import { User } from "@prisma/client";
import fetcher from "@/lib/fetcher";

import * as Yup from "yup";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SubmitButton from "../shared/submitButton";
import { toast } from "sonner";
import { mutate } from "swr";
import { LoadingSpinner } from "../shared/icons";
import { Button } from "../ui/button";

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
  const { data } = useSWR<UserInfos>("/api/user", fetcher);
  const { user } = data || {};

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
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, submitForm }) => (
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
            <SubmitButton
              label="Update Profile"
              submitForm={submitForm}
              isSubmitting={isSubmitting}
              showShortcutIcons={false}
            />
          </Form>
        )}
      </Formik>

      <div className="mt-4">
        <Button
          className="w-full"
          variant={"destructive"}
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
