import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export default function TasksPageSkeletonLoading() {
  const columns = Array(5).fill(null); // Replace 5 with the number of columns you want

  return (
    <div className="w-full space-y-4">
      <div className="mb-4 h-6 w-1/4 rounded bg-zinc-800"></div>{" "}
      {/* Placeholder for "Tasks" h3 element */}
      <div className="mb-4 flex space-x-4">
        <div className="h-6 w-1/3 rounded bg-zinc-800"></div>{" "}
        {/* Placeholder for "filter tasks" select */}
        <div className="h-6 w-1/3 rounded bg-zinc-800"></div>{" "}
        {/* Placeholder for "status or priority" select */}
        <div className="h-6 w-1/3 rounded bg-zinc-800"></div>{" "}
        {/* Placeholder for "view columns" select */}
      </div>
      <div className="rounded-md border border-zinc-700">
        <Table>
          <thead>
            <TableRow
                className={'border-b border-zinc-700'}
            >
              {columns.map((_column: any, index: any) => (
                <TableHead key={index}>
                  <div className="h-6 w-full rounded bg-zinc-800"></div>
                </TableHead>
              ))}
            </TableRow>
            <TableRow
                className={'border-b border-zinc-700'}
            >
              {columns.map((_column: any, index: any) => (
                <TableHead key={index}>
                  <div className="h-6 w-full rounded bg-zinc-800"></div>
                </TableHead>
              ))}
            </TableRow>
          </thead>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow
                  key={rowIndex}
                  className={'border-b border-zinc-700'}
              >
                {columns.map((_column: any, colIndex: any) => (
                  <TableCell key={colIndex}>
                    <div className="h-4 w-full rounded bg-zinc-800"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
