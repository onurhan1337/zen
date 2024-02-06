import React from "react";
import useSWR from "swr";
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import fetcher from "@/lib/fetcher";
import {Project} from "../../../types/project";
import {Box, Card, Heading} from "@radix-ui/themes";

type Data = {
    projects?: {
        data: Project[]
    }
    projectCount: number;
    taskCount: number;
};

const AllProjectsChart = () => {
    const {data: projectData, error} = useSWR<Data>("/api/project/stats", fetcher);

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!projectData) {
        return (
            <Card variant={'surface'}>
                <Box
                    style={{
                        padding: 5
                    }}
                >
                    <Heading>
                        Projects Overview
                    </Heading>
                </Box>
                <Box
                    style={{
                        padding: 5,
                        marginTop: 10
                    }}
                >
                    <SkeletonBarChart />
                </Box>
            </Card>
        );
    }

    /**
     * @param {Data} projectData
     * @return {JSX.Element}
     * @see https://recharts.org/en-US/api/BarChart
     */
    const chartData = projectData.projects?.data.map(project => ({
        name: project.name, tasks: project.tasks.length
    }));

    return (
        <Card variant={'surface'}>
            <Box
                style={{
                    padding: 5
                }}
            >
                <Heading>
                    Projects Overview
                </Heading>
            </Box>
            <Box
                style={{
                    padding: 5,
                    marginTop: 10

                }}
            >
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <XAxis stroke="#888888"
                               fontSize={12}
                               tickLine={false}
                               axisLine={false}
                               dataKey="name"/>
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{color: '#070809'}}
                            itemStyle={{color: '#8c8c8c'}}
                            cursor={{fill: 'rgba(38,38,38,0.3)'}}
                        />
                        <Bar
                            fill="#d4d4d8"
                            dataKey="tasks"
                            className={'fill-zinc-300'}
                            radius={[4, 4, 0, 0]}
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
    const placeholderData = Array.from({ length: 10 }, (_, i) => ({ name: `Placeholder ${i}`, tasks: Math.random() * 30 }));

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={placeholderData}>
                <XAxis stroke="#888888"
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}
                       dataKey="name"/>
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{color: '#070809'}}
                    cursor={{fill: 'rgba(0,0,0,0.3)'}}
                />
                <Bar
                    fill="#d4d4d8"
                    dataKey="tasks"
                    className={'fill-zinc-300'}
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};