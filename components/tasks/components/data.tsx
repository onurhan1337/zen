import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { TaskStatus, Priority } from "types/task";

export const statuses = [
  {
    value: TaskStatus.BACKLOG,
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: TaskStatus.TODO,
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: TaskStatus.DONE,
    label: "Done",
    icon: CheckCircledIcon,
  },
];

export const priorities = [
  {
    value: Priority.LOW,
    label: "Low",
    icon: ArrowDownIcon,
  },
  {
    value: Priority.MEDIUM,
    label: "Medium",
    icon: ArrowRightIcon,
  },
  {
    value: Priority.HIGH,
    label: "High",
    icon: ArrowUpIcon,
  },
];
