import { ArrowUpIcon, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Task } from "types/task";
import StatusBadge from "../statusBadge";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.startDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.original.endDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-3 w-3 text-gray-400" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className={"h-3 w-24 rounded-full bg-gray-100 px-2 py-1 text-gray-400"}
      >
        {row.original.priority}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description,
  },
];
