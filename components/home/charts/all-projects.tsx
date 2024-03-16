import fetcher from "@/lib/fetcher";
import { Box, Card, Heading, Text } from "@radix-ui/themes";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import { Project } from "../../../types/project";

type Data = {
  projects?: {
    data: Project[];
  };
  projectCount: number;
  taskCount: number;
};

const AllProjectsChart = () => {
  const { data: projectData, error } = useSWR<Data>(
    "/api/project/stats",
    fetcher,
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!projectData) {
    return (
      <Card
        variant={"surface"}
        style={{
          width: "100%",
        }}
      >
        <Box>
          <Heading>Projects Overview</Heading>
        </Box>
        <Box
          style={{
            padding: 5,
            marginTop: 10,
          }}
        >
          <SkeletonBarChart />
        </Box>
      </Card>
    );
  }

  if (projectData && projectData.projects?.data.length === 0) {
    return (
      <Card
        variant={"surface"}
        style={{
          padding: 5,
          width: "100%",
        }}
      >
        <Box
          style={{
            padding: 5,
          }}
        >
          <Heading>Projects Overview</Heading>
        </Box>
        <Box
          style={{
            padding: 10,
          }}
        >
          <Box className={"rounded-lg border border-zinc-600 p-4"}>
            <Text align="center" as="div">
              No projects created yet.
            </Text>
          </Box>
        </Box>
      </Card>
    );
  }

  /**
   * @param {Data} projectData
   * @return {JSX.Element}
   * @see https://recharts.org/en-US/api/BarChart
   */
  const chartData = projectData.projects?.data.map((project) => ({
    name: project.name,
    tasks: project.tasks.length,
  }));

  return (
    <Card
      variant={"surface"}
      style={{
        padding: 5,
        width: "100%",
      }}
    >
      <Box
        style={{
          padding: 5,
        }}
      >
        <Heading>Projects Overview</Heading>
      </Box>
      <Box
        style={{
          padding: 5,
          marginTop: 10,
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dataKey="name"
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ color: "#070809" }}
              itemStyle={{ color: "#8c8c8c" }}
              cursor={{ fill: "rgba(38,38,38,0.3)" }}
            />
            <Bar
              fill="#d4d4d8"
              dataKey="tasks"
              className={"fill-zinc-300"}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default React.memo(AllProjectsChart);

const SkeletonBarChart = () => {
  // Create an array of 10 placeholder data
  const placeholderData = Array.from({ length: 7 }, (_, i) => ({
    name: `Project ${i}`,
    tasks: Math.random() * 30,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={placeholderData}>
        <XAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dataKey="name"
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ color: "#070809" }}
          cursor={{ fill: "rgba(0,0,0,0.3)" }}
        />
        <Bar
          fill="#d4d4d8"
          dataKey="tasks"
          className={"fill-zinc-300"}
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
