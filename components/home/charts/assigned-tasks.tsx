import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Badge, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { differenceInDays, isPast, parseISO } from 'date-fns';

import fetcher from "@/lib/fetcher";
import { Task } from "../../../types/task";
import StatusBadge from "@/components/tasks/statusBadge";
import { handleIconForPriority } from "@/components/projects/board/taskItem";

const resolveDaysLeftText = (startDate: string, endDate: string) => {
    if (isPast(parseISO(endDate))) {
        return 'Date has expired';
    }
    return `${differenceInDays(parseISO(endDate), parseISO(startDate))} days left`;
}

const TaskChart = () => {
    const [page, setPage] = useState(1);
    const loader = useRef(null);
    const { data: taskData } = useSWR<Task[]>("/api/task/assigned", fetcher);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { root: null, rootMargin: "20px", threshold: 1.0 });
        if (loader.current) {
            observer.observe(loader.current)
        }
    }, []);

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setPage((prev) => prev + 1);
        }
    }

    if (!taskData) return <SkeletonLoader />;

    return (
        <Card style={{ padding: 5 }}>
            <Box position={'sticky'} style={{ padding: 5 }}>
                <Heading>Assigned Tasks</Heading>
            </Box>
            <Box style={{ padding: 10, maxHeight: 300, overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.1) rgba(0,0,0,0.05)' }}>
                {taskData && taskData.length > 0 ? (
                    taskData.map((task, index) => <TaskRow key={task.id} task={task} />)
                ) : (
                    <Box className={'border border-zinc-600 rounded-lg p-4'}>
                        <Text align="center" as="div">No tasks assigned yet.</Text>
                    </Box>
                )}
                <div ref={loader} />
            </Box>
        </Card>
    );
};

const TaskRow = ({ task }: { task: Task }) => (
    <Flex direction={'column'} key={task.id}>
        <Flex direction={{ initial: 'column', md: 'row' }} align={'center'} justify={'between'} className={'py-2 px-4 my-2 space-y-4 md:space-y-0 border border-zinc-600 rounded-lg'}>
            <Text size="2" trim="both">{task.name}</Text>
            <Box className={'flex space-x-2'}>
                <StatusBadge status={task.status} />
                <Badge color={'gray'} radius={'large'} variant={'surface'} highContrast={true}>
                    {task.priority.toUpperCase()} {handleIconForPriority(task.priority)}
                </Badge>
                <Badge color={'crimson'}>{resolveDaysLeftText(task.startDate, task.endDate)}</Badge>
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
                    position={'sticky'}
                >
                    <Heading>
                        Assigned Tasks
                    </Heading>
                </Box>
                <Box
                    style={{
                        padding: 10,
                        maxHeight: 300,
                        overflowY: 'scroll',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(0,0,0,0.1) rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Display 10 skeleton rows while loading */}
                    {[...Array(5)].map((_, index) => (
                        <SkeletonRow key={index} />
                    ))}
                </Box>
            </Card>
        );
}

const SkeletonRow = () => {
    return (
        <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Flex direction={'column'}>
                <Flex
                    direction={{
                        initial: 'column', md: 'row'
                    }}
                    align={'center'}
                    justify={'between'}
                    className={'py-2 px-4 my-2 space-y-4 md:space-y-0 border border-zinc-600 rounded-lg'}
                >
                    <div style={{ backgroundColor: '#444444', height: '20px', width: '200px' }} />
                    <Box
                        className={'flex space-x-2'}
                    >
                        <div style={{ backgroundColor: '#444444', height: '20px', width: '60px' }} />
                        <div style={{ backgroundColor: '#444444', height: '20px', width: '60px' }} />
                        <div style={{ backgroundColor: '#444444', height: '20px', width: '60px' }} />
                    </Box>
                </Flex>
            </Flex>
        </div>
    );
};