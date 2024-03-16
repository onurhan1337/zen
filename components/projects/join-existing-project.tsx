import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Field, Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

interface JoinExistingProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  inviteCode: string;
}

export default function JoinExistingProject({
  isOpen,
  onClose,
}: JoinExistingProjectProps) {
  const validationSchema = Yup.object().shape({
    inviteCode: Yup.string().required("Invite code is required"),
  });

  const initialValues: FormValues = {
    inviteCode: "",
  };

  const onSubmit = async (values: FormValues) => {
    const res = await fetch(`/api/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: values.inviteCode }),
    });

    if (res.ok) {
      onClose();
      toast.success("Successfully sent a request to join the project");
      window.location.reload();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Join existing project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          You must have an invite code to join a project.
        </Dialog.Description>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Invite Code
                </Text>
                <Field
                  required
                  type="text"
                  color={"blue"}
                  name="inviteCode"
                  as={TextField.Input}
                  autoComplete={"off"}
                />
              </label>
            </Flex>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type={"submit"} color={"blue"}>
                Join
              </Button>
            </Flex>
          </Form>
        </Formik>
      </Dialog.Content>
    </Dialog.Root>
  );
}
