import { useRouter } from "next/router";
import { mutate } from "swr";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

import * as Yup from "yup";
import { format } from "date-fns";

import { capitalize, cn } from "@/lib/utils";
import { Project, ProjectStatus, ProjectStatusType } from "types/project";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { projectCreateFormState } from "@/lib/store";
import SubmitButton, {DialogCloseButton} from "@/components/shared/submitButton";

interface FormValues {
  name: string;
  status: ProjectStatusType;
  startDate: Date;
  endDate: Date;
  description: string;
}

const ProjectCreateForm = () => {
  const router = useRouter();
  const { setOpen } = projectCreateFormState();

  const initialValues: FormValues = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    status: ProjectStatus.ACTIVE,
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    status: Yup.string<ProjectStatus>().required(ProjectStatus.ACTIVE),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date().required("Required").min(Yup.ref("startDate")),
    description: Yup.string().required("Required"),
  });

  async function createProject(values: FormValues) {
    try {
      const res = await fetch("/api/project", {
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

      if (!res.ok) {
        toast.error("Something went wrong!");
      }

      return res.json();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setOpen(false);
    }
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      toast.loading("Creating Project...");

      const newProject = await createProject(values);

      if (newProject) {
        mutate(
          "/api/project",
          (data: Project[] | undefined) => {
            if (Array.isArray(data)) {
              return [...data, newProject];
            }
            return data;
          },
          true, // Revalidate the data
        );
      }

      toast.success("Project created successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setOpen(false);
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
            className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5"
          >
            <div className="relative col-span-2 mt-2 md:col-span-1 space-y-1">
              <Label htmlFor="name">Name</Label>
              <Field
                as={Input}
                type="text"
                name="name"
                id="name"
              />
              <ErrorMessage
                name="name"
                className="py-1 text-xs italic text-red-500"
                component="div"
              />
            </div>

            <div className="relative col-span-2 mt-2 md:col-span-1 space-y-1">
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
                  {Object.values(ProjectStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {capitalize(status)}
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
            <div className="relative col-span-1 mt-4 flex flex-col space-y-1">
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
            <div className="flex items-center justify-end gap-2 col-span-2">
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

export default ProjectCreateForm;

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
