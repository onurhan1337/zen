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

interface FormValues {
  name: string;
}

// data comes from SWR -> data.user.userInfo
// this is the type of data.user.userInfo
type UserInfos = {
  user: User;
};

const SettingsForm = () => {
  const { data } = useSWR<UserInfos>("/api/user", fetcher);
  const user = data?.user;

  const initialValues: FormValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3),
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
      toast.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // or return an error message
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
    </div>
  );
};

export default SettingsForm;
