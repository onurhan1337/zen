import React from "react";
import useSWR from "swr";
import {Badge, Box, Card, Flex, Heading, Text} from "@radix-ui/themes";
import { differenceInDays, parseISO } from 'date-fns';

import fetcher from "@/lib/fetcher";
import {Task} from "../../../types/task";
import StatusBadge from "@/components/tasks/statusBadge";
import {handleIconForPriority} from "@/components/projects/board/taskItem";

type Data = Task[];

const TaskChart = () => {
    const [page, setPage] = React.useState(1);
    const loader = React.useRef(null);

    const {data: taskData} = useSWR<Data>("/api/task/assigned", fetcher);

    /**
     * Calculates the number of days left from the start date to the end date.
     * @param {string} startDate - The start date in ISO string format.
     * @param {string} endDate - The end date in ISO string format.
     * @returns {number} The number of days left.
     * @see https://date-fns.org/v2.23.0/docs/differenceInDays
     */
    const daysLeft = (startDate: string, endDate: string): number => {
        return differenceInDays(parseISO(startDate), parseISO(endDate));
    }

    React.useEffect(() => {
        let options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, options);
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

    const Row = ({ index, style }: {
        index: number;
        style: React.CSSProperties;
    }) => {
        const task = taskData[index];
        return (
            <div style={style}>
                <Flex direction={'column'} key={task.id}>
                    <Flex
                        direction={{
                            initial: 'column', md: 'row'
                        }}
                        align={'center'}
                        justify={'between'}
                        className={'py-2 px-4 my-2 space-y-4 md:space-y-0 border border-zinc-600 rounded-lg'}
                    >
                        <Text
                            size="2"
                            trim="both"
                        >
                            {task.name}
                        </Text>
                        <Box
                            className={'flex space-x-2'}
                        >
                            <StatusBadge status={task.status}/>
                            <Badge
                                color={'gray'}
                                radius={'large'}
                                variant={'surface'}
                                highContrast={true}
                            >
                                {task.priority.toUpperCase()} {handleIconForPriority(task.priority)}
                            </Badge>
                            <Badge
                                color={'crimson'}
                            >
                                {daysLeft(task.startDate, task.endDate)} days left
                            </Badge>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        );
    };

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
                {taskData && taskData.length > 0 ? (
                    <Box>
                        {taskData.map((task, index) => (
                            <Row key={task.id} index={index} style={{}}/>
                        ))}
                        <div ref={loader} />
                    </Box>
                ) : (
                    <Box
                        className={'border border-zinc-600 rounded-lg p-4'}
                    >
                        <Text align="center" as="div">No tasks assigned yet.</Text>
                    </Box>
                )}
            </Box>
        </Card>
    );
};

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
                    {[...Array(10)].map((_, index) => (
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
                    <p style={{ backgroundColor: '#a0a0a0', height: '20px', width: '70%' }}/>
                    <Box
                        className={'flex space-x-2'}
                    >
                        <div style={{ backgroundColor: '#a0a0a0', height: '20px', width: '60px' }} />
                        <div style={{ backgroundColor: '#a0a0a0', height: '20px', width: '60px' }} />
                        <div style={{ backgroundColor: '#a0a0a0', height: '20px', width: '60px' }} />
                    </Box>
                </Flex>
            </Flex>
        </div>
    );
};