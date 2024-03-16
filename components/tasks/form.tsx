import { format } from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import * as Yup from "yup";

import SubmitButton, {
  DialogCloseButton,
} from "@/components/shared/submitButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskCreateFormState } from "@/lib/store";
import { capitalize, cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Checkbox, Flex, Text } from "@radix-ui/themes";
import { Priority, Task, TaskStatus } from "types/task";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface Data {
  members: User[];
}

const TaskCreateForm = () => {
  const router = useRouter();
  const [assignToMe, setAssignToMe] = useState<boolean>(false);
  const { data } = useSWR<Data>(`/api/project/${router.query.id}`);
  const { setOpen } = taskCreateFormState();

  const initialValues: FormValues = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    status: TaskStatus.BACKLOG,
    priority: Priority.LOW,
    assignedTo: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    status: Yup.string<TaskStatus>().required("Required"),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date().required("Required").min(Yup.ref("startDate")),
    description: Yup.string().required("Required"),
  });

  interface FormValues {
    name: string;
    status: TaskStatus;
    startDate: Date;
    endDate: Date;
    priority: Priority;
    assignedTo: string;
    description: string;
  }

  async function createTask(
    values: FormValues,
    projectId: string | string[] | undefined,
  ) {
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
        priority: values.priority,
        assignedTo: values.assignedTo,
        description: values.description,
        projectId: projectId,
        assignToMe: assignToMe,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      const newTask = await createTask(values, router.query.id);

      mutate(
        `/api/project/${router.query.id}/task`,
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
            className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5"
          >
            <div className="relative col-span-2 mt-2 space-y-1 md:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Field as={Input} type="text" name="name" id="name" />
              <ErrorMessage
                name="name"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-2 space-y-1 md:col-span-1">
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
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TaskStatus).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {capitalize(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Field>
              <ErrorMessage
                name="status"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-1 mt-4 flex flex-col space-y-1">
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

            <div className="relative col-span-1 mt-4 space-y-1">
              <Label htmlFor="priority">Priority</Label>
              <Field
                as={Select}
                name="priority"
                id="priority"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                value={values.priority}
                onValueChange={(value: string) =>
                  setFieldValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(Priority).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {capitalize(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Field>
              <ErrorMessage
                name="priority"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-1 mt-4 space-y-1">
              <Label htmlFor="priority">Assigned To</Label>
              <Field
                as={Select}
                name="assignedTo"
                id="assignedTo"
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                value={values.assignedTo}
                onValueChange={(value: string) =>
                  setFieldValue("assignedTo", value)
                }
                disabled={!data?.members.length || assignToMe}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {data?.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Field>
              <ErrorMessage
                name="priority"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-4 space-y-1">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
                name="description"
                id="description"
                rows={5}
              />
              <ErrorMessage
                name="description"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div
              className={
                "relative mt-4 flex flex-row items-center justify-start space-y-1"
              }
            >
              <Text as={"label"} size={"2"}>
                <Flex gap={"2"}>
                  <Checkbox
                    checked={assignToMe}
                    onCheckedChange={(checked: boolean) => {
                      setAssignToMe(checked);
                    }}
                    color={"blue"}
                  />{" "}
                  Assign to myself
                </Flex>
              </Text>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2">
              <DialogCloseButton />
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
