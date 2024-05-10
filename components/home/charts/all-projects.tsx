import fetcher from "@/lib/fetcher";
import { Box, Card, Heading } from "@radix-ui/themes";
import { RiBarChartFill } from '@remixicon/react';
import { AreaChart } from '@tremor/react';

import useSWR from "swr";
import ProjectCreateContent from "../projects/create";

type Data = {
  projects: number;
  tasks: number;
  members: number;
};

const AllProjectsChart = () => {
  const { data } = useSWR<Data[]>("/api/stats/projects-overview", fetcher, {
    keepPreviousData: true,
  });

  if (!data || data.length === 0) return <EmptyCard />;

  return (
    <Card  
      style={{
        padding: 5,
        width: '100%',
        }}
      variant='surface' 
    >
        <Heading size={'4'}>Projects Overview</Heading>
        <AreaChart
          className="h-80"
          data={data}
          index={'name'}
          categories={["tasks", "members"]}
          colors={['purple', 'lime']}
          yAxisWidth={60}
          showAnimation={true}
        />
    </Card>
  );
};

export default AllProjectsChart;

const EmptyCard = () => (
  <Card 
    style={{
      padding: 5,
      width: '100%',
    }}
  >
  <Box style={{ padding: 5 }}>
        <Heading size={'4'}>Projects Overview</Heading>
  </Box>
    
  <Box style={{ padding: 5, marginTop: 10 }}>

    <div className="mt-4 flex h-44 items-center justify-center rounded-tremor-small border border-dashed p-4 dark:border-dark-tremor-content-subtle">
      <div className="text-center">
        <RiBarChartFill
          className="mx-auto h-7 w-7 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
          aria-hidden={true}
        />
        <p className="mt-2 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          No data to show
        </p>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Create a project to get started
        </p>
        <div className="mt-4">
        <ProjectCreateContent />
        </div>
      </div>
    </div>
      </Box>
</Card>
);