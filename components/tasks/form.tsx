import { useRouter } from "next/router";
import { mutate } from "swr";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "sonner";
import { CommandIcon, CornerDownLeftIcon, CalendarIcon } from "lucide-react";

import * as Yup from "yup";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Task } from "types/task";
import { LoadingDots } from "@/components/shared/icons";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { taskCreateFormState } from "@/lib/store";

interface FormValues {
  name: string;
  startDate: Date;
  endDate: Date;
  status: "backlog" | "todo" | "in-progress" | "done";
  description: string;
}

const TaskCreateForm = () => {
  const router = useRouter();
  const { setOpen } = taskCreateFormState();

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
    endDate: Yup.date().required("Required").min(Yup.ref("startDate")),
    description: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          status: values.status,
          description: values.description,
          projectId: router.query.id,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();

        // Update local data without revalidation
        mutate(
          `/api/task/${router.query.id}`,
          (data: Task[] | undefined) => {
            if (Array.isArray(data)) {
              return [...data, newTask];
            }
            return data;
          },
          true,
        );

        toast.success("Task created successfully!");
        setOpen(false);
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
        {({ isSubmitting, submitForm, values, setFieldValue }) => (
          <Form
            onKeyDown={(e) => handleOnKeyDown(e, submitForm)}
            className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5"
          >
            <div className="relative col-span-2 mt-2 md:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Field
                as={Input}
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
              <Label htmlFor="status">Status</Label>
              <Field
                as={Select}
                name="status"
                id="status"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                value={values.status}
                onValueChange={(value: string) =>
                  setFieldValue("status", value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Field>
              <ErrorMessage
                name="status"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-1 mt-4 flex flex-col space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Field
                as={DatePicker}
                name="startDate"
                id="startDate"
                date={values.startDate}
                setDate={(date: Date) => setFieldValue("startDate", date)}
              />
              <ErrorMessage
                name="startDate"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>
            <div className="relative col-span-1 mt-4 flex flex-col space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Field
                as={DatePicker}
                name="endDate"
                id="endDate"
                date={values.endDate}
                setDate={(date: Date) => setFieldValue("endDate", date)}
              />
              <ErrorMessage
                name="endDate"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
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
    <Button
      className="flex w-full items-center justify-center space-x-2"
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <LoadingDots color="#FFFFFF" />
      ) : (
        <>
          <div
            className="inline-flex items-center justify-center space-x-1
            rounded-lg border border-zinc-600 px-2 py-1 text-xs
          "
          >
            <CommandIcon width="14" height="14" />
            <CornerDownLeftIcon width="14" height="14" />
          </div>
          <span>Create</span>
        </>
      )}
    </Button>
  );
}

function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onDayClick={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
