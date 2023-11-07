import { useRouter } from "next/router";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "sonner";
import { CommandIcon, CornerDownLeftIcon } from "lucide-react";

import * as Yup from "yup";

import { useDrawerStore } from "@/lib/store";
import { LoadingDots } from "@/components/shared/icons";

interface FormValues {
  name: string;
  startDate: Date;
  endDate: Date;
  status: "backlog" | "todo" | "in-progress" | "done";
  description: string;
}

const TaskCreateForm = () => {
  const { setOpen } = useDrawerStore();
  const router = useRouter();

  const initialValues: FormValues = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "backlog",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    status: Yup.string<"backlog" | "todo" | "in-progress" | "done">().required(
      "Required",
    ),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date().required("Required"),
    description: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          startDate,
          endDate,
          status: values.status,
          description: values.description,
          projectId: router.query.id,
        }),
      });

      // if successful, redirect to project detail page
      if (res.ok) {
        setOpen(false);
        // reload page to get the latest data
        router.reload();
      }

      if (!res.ok) {
        const error = await res.text();
        toast.error(error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /**
   * Handles the onKeyDown event on the form.
   *
   * @param e - The keyboard event.
   * @param submitForm - The function to submit the form.
   */
  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLFormElement>,
    submitForm: () => void,
  ) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Enter" || e.key === "NumpadEnter")
    ) {
      e.preventDefault();
      submitForm();
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, submitForm, values }) => (
          <Form
            onKeyDown={(e) => handleOnKeyDown(e, submitForm)}
            className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5"
          >
            <div className="relative col-span-2 mt-2 md:col-span-1">
              <label
                htmlFor="name"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
              >
                Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
              />
              <ErrorMessage
                name="name"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-2 md:col-span-1">
              <label
                htmlFor="status"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
              >
                Status
              </label>
              <Field
                as="select"
                name="status"
                id="status"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                value={values.status}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Field>
              <ErrorMessage
                name="status"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-4 md:col-span-1">
              <label
                htmlFor="startDate"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
              >
                Start Date
              </label>
              <Field
                type="datetime-local"
                name="startDate"
                id="startDate"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
              />
              <ErrorMessage
                name="startDate"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>
            <div className="relative col-span-2 mt-4 md:col-span-1">
              <label
                htmlFor="endDate"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
              >
                End Date
              </label>
              <Field
                type="datetime-local"
                name="endDate"
                id="endDate"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
              />
              <ErrorMessage
                name="endDate"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-4">
              <label
                htmlFor="description"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
              >
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="block w-full resize-none rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                rows={5}
              />
              <ErrorMessage
                name="description"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>
            <div className="col-span-2">
              <SubmitButton
                isSubmitting={isSubmitting}
                submitForm={submitForm}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskCreateForm;

function SubmitButton({
  submitForm,
  isSubmitting,
}: {
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}) {
  const handleSubmit = () => {
    submitForm();
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="my-4 inline-flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-transparent bg-[#BDE56C] px-4 py-2 text-sm font-normal text-black shadow-sm hover:bg-[#bdee63]"
    >
      {isSubmitting ? (
        <LoadingDots color="#070809" />
      ) : (
        <>
          <div
            className="inline-flex items-center justify-center space-x-1
            rounded-lg border border-lime-900 px-2 py-1 text-xs
          "
          >
            <CommandIcon width="14" height="14" />
            <CornerDownLeftIcon width="14" height="14" />
          </div>
          <span>Create</span>
        </>
      )}
    </button>
  );
}
