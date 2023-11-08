import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SubmitButton from "../shared/submitButton";
import { toast } from "sonner";

interface FormValues {
  name: string;
}

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const SettingsForm = ({ user }: SettingsFormProps) => {
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
