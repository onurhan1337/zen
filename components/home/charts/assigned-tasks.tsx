import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { differenceInCalendarDays, isPast, parseISO } from "date-fns";
import React, { Suspense } from "react";
import useSWR from "swr";

import { handleIconForPriority } from "@/components/projects/board/taskItem";
import StatusBadge from "@/components/tasks/statusBadge";
import fetcher from "@/lib/fetcher";
import { Task } from "../../../types/task";

/*
 * @function resolveDaysLeftText
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
const resolveDaysLeftText = (startDate: string, endDate: string) => {
  if (isPast(parseISO(endDate))) {
    return "Date has expired";
  }
  return `${differenceInCalendarDays(parseISO(endDate), parseISO(startDate))} days left`;
};

const TaskChart = () => {
  const { data: taskData } = useSWR<Task[]>("/api/task/assigned", fetcher);

  if (!taskData) return <SkeletonLoader />;

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Card variant="surface" style={{ padding: 5 }}>
        <Box>
          <Heading>Assigned Tasks</Heading>
        </Box>
        <ScrollArea
          className={"my-4 rounded-lg border border-zinc-700"}
          style={{ maxHeight: 300 }}
        >
          {taskData && taskData.length > 0 ? (
            taskData.map((task, index) => <TaskRow key={task.id} task={task} />)
          ) : (
            <Box className={"rounded-lg border border-zinc-600 p-4"}>
              <Text align="center" as="div">
                No tasks assigned yet.
              </Text>
            </Box>
          )}
        </ScrollArea>
      </Card>
    </Suspense>
  );
};

const TaskRow = ({ task }: { task: Task }) => (
  <Flex
    direction={"column"}
    px={{
      initial: "0",
      md: "4",
    }}
    key={task.id}
  >
    <Flex
      direction={{ initial: "column", md: "row" }}
      align={"center"}
      justify={"between"}
      className={
        "my-2 space-y-4 rounded-lg border border-zinc-800 px-4 py-2 md:space-y-0"
      }
    >
      <Text size="2" trim="both">
        {task.name}
      </Text>
      <Box className={"flex space-x-2"}>
        <StatusBadge status={task.status} />
        <Badge
          color={"gray"}
          radius={"large"}
          variant={"surface"}
          highContrast={true}
        >
          {task.priority.toUpperCase()} {handleIconForPriority(task.priority)}
        </Badge>
        <Badge color={"crimson"}>
          {resolveDaysLeftText(task.startDate, task.endDate)}
        </Badge>
      </Box>
    </Flex>
  </Flex>
);

export default React.memo(TaskChart);

const SkeletonLoader = () => {
  return (
    <Card
      style={{
        padding: 5,
      }}
    >
      <Box
        style={{
          padding: 5,
        }}
        position={"sticky"}
      >
        <Heading>Assigned Tasks</Heading>
      </Box>

      {[...Array(3)].map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </Card>
  );
};

const SkeletonRow = () => {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #111111" }}>
      <Flex direction={"column"}>
        <Flex
          direction={{
            initial: "column",
            md: "row",
          }}
          align={"center"}
          justify={"between"}
          className={
            "my-2 space-y-4 rounded-lg border border-zinc-800 px-4 py-2 md:space-y-0"
          }
        >
          <div
            style={{
              backgroundColor: "#222222",
              height: "20px",
              width: "200px",
            }}
          />
          <Box className={"flex space-x-2"}>
            <div
              style={{
                backgroundColor: "#222222",
                height: "20px",
                width: "60px",
              }}
            />
            <div
              style={{
                backgroundColor: "#222222",
                height: "20px",
                width: "60px",
              }}
            />
            <div
              style={{
                backgroundColor: "#222222",
                height: "20px",
                width: "60px",
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};
