import { TaskStatus } from "types/task";

interface FormValues {
  name: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  description: string;
}

export async function createTask(
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
      description: values.description,
      projectId: projectId,
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
