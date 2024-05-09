import { Badge } from "@radix-ui/themes";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Priority, Task, TaskStatus } from "types/task";

const TASKS: Task[] = [
    {
        id: "1",
        name: "Task 1",
        description: "This is a task description.",
        status: TaskStatus.BACKLOG,
        priority: Priority.LOW,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
    {
        id: "2",
        name: "Task 2",
        description: "This is a task description.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
    {
        id: "3",
        name: "Task 3",
        description: "This is a task description.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
    {
        id: "4",
        name: "Task 4",
        description: "This is a task description.",
        status: TaskStatus.DONE,
        priority: Priority.LOW,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
    {
        id: "5",
        name: "Task 5",
        description: "This is a task description.",
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
    {
        id: "6",
        name: "Task 6",
        description: "This is a task description.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: "1",
        memberId: ["1", "2"],
        assignee: null
    },
]

const BentoTaskBoardList = () => {

  const initializeBoard = (tasks: Task[]) => {
    return tasks.reduce((sections, task) => {
      const { status } = task;
      sections[status] = sections[status] ? [...sections[status], task] : [task];
      return sections;
    }, {} as Record<TaskStatus, Task[]>);
  };

  const [boardSections, setBoardSections] = useState(() => initializeBoard(TASKS));
  const [task, setTask] = useState<Task | null>(null);

  return (
    <div className="my-4 grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-4">
        {Object.keys(boardSections).map((sectionKey) => {
          return (
            <div key={sectionKey} className="col-span-1">
              <BentoTaskBoard title={sectionKey} tasks={boardSections[sectionKey as TaskStatus]} />
            </div>
          );
        })}

    </div>
  );
};

export default BentoTaskBoardList;

const BentoTaskBoard = ({ tasks, title }: { tasks: Task[], title: string }) => {

  return (
    <div className="w-full rounded-md p-4 shadow-sm sm:p-3">
    <div
    >
      <h4 className="mb-4 scroll-m-20 text-lg font-semibold tracking-tighter
        bg-zinc-900 border border-zinc-800 w-full rounded-md shadow-sm p-2 text-center">
        {title}
      </h4>

        {tasks.map((task) => (
          <div key={task.id}>
              <BentoTaskItem task={task} />
          </div>
        ))}
    </div>
    </div>
  );
};

const BentoTaskItem = ({ task }: { task: Task }) => {
  return (
    <div className="rounded-md border border-zinc-800 p-4"
    >
        <div className="flex cursor-move items-center justify-between">
        <h4 className="antialised scroll-m-20 text-lg font-medium tracking-tight md:subpixel-antialiased">
            {task.name}
          </h4>{" "}
          <GripVertical size={16} className="text-zinc-500" />
        </div>

        <p className="antialised text-sm font-normal leading-7  md:subpixel-antialiased">
          {task.description}
        </p>

        {task.assignee && (
          <Badge
            className="mt-2 border border-blue-900 bg-blue-50 uppercase text-blue-500"
            size={"1"}
            radius="full"
          >
            {task.assignee.name}
          </Badge>
        )}
    </div>
  );
};