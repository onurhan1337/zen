"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { format } from "date-fns";
import * as Yup from "yup";

import { LoadingDots } from "@/components/shared/icons";

enum ProjectStatus {
  Active = "active",
  Inactive = "inactive",
}

interface FormValues {
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  description: string;
}

const ProjectCreateForm = () => {
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Active);

  const initialValues: FormValues = {
    name: "",
    status: ProjectStatus.Active,
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
    startDate: Yup.string().required("Required"),
    endDate: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ProjectStatus);
  };

  const handleSubmit = async (values: FormValues) => {
    await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
      }),
    });
  };

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, submitForm }) => (
          <Form>
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

            <div className="relative col-span-2 mt-4 md:col-span-1">
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
                value={status}
                onChange={handleStatusChange}
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
              >
                {Object.entries(ProjectStatus).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="status"
                className="text-xs italic text-red-500"
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
                type="date"
                name="startDate"
                id="startDate"
                defaultValue={new Date().toISOString().slice(0, 10)}
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
                type="date"
                name="endDate"
                id="endDate"
                min={new Date().toISOString().slice(0, 10)}
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
            <SubmitButton isSubmitting={isSubmitting} submitForm={submitForm} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProjectCreateForm;

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
      className="my-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-normal text-white shadow-sm hover:bg-blue-700"
    >
      {isSubmitting ? <LoadingDots color="#FFFFFF" /> : "Create"}
    </button>
  );
}
