import React, { ReactNode } from "react";
import useSWR from "swr";
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { FolderCog2, ListChecks, UsersIcon } from 'lucide-react';

import fetcher from "@/lib/fetcher";
import { cn } from "@/lib/utils";

type Data = {
    projects: { recent: number, total: number };
    tasks: { recent: number, total: number };
    members: {
        recent: number,
        total: number
    };
};

const AllStats = () => {
    const { data } = useSWR<Data>('/api/stats/kpi-overview', fetcher);

    if (!data) {
        return (
            <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </Box>
        );
    }

    return (
        <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && (
                <>
                    <StatCard
                        heading="Projects"
                        data={data.projects}
                        icon={<FolderCog2 size={24} />}
                    />
                    <StatCard
                        heading="Tasks"
                        data={data.tasks}
                        icon={<ListChecks size={24} />}
                    />
                    <StatCard
                        heading="Users"
                        data={data.members}
                        icon={<UsersIcon size={24} />}
                    />
                </>
            )
            }
        </Box>
    );
}

interface StatCardProps {
    heading: string;
    data: { recent: number, total: number } | number;
    icon: ReactNode;
}

const StatCard = React.memo(({ heading, data, icon }: StatCardProps) => {

    const resolveChangeMessage = (recent: number, total: number) => {
        if (total === 0) {
            return 'No data from last month';
        }

        if (recent === total) {
            return 'No change from last month';
        }

        const percentage = Math.abs(Math.floor((recent / total - 1) * 100));
        let symbol = recent > total ? '+' : '-';
        if (percentage === 0) {
            return `Less than 1% change from last month`;
        }

        return `${symbol}${percentage}% from last month`;
    };

    const changeType = (recent: number, total: number) => {
        if (recent > total) {
            return 'positive';
        } else if (recent < total) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }

    return (
        <Card variant='surface'>
            <Flex align='center' justify='between' className='p-2'>
                <Heading as="h3" size='3' weight='bold'>{heading}</Heading>
                {icon}
            </Flex>
            {typeof data === 'object' ? (
                <Box className='p-2 gap-4'>
                    <Box>
                        <Heading size={'6'} mb={'4'}>{data.total}</Heading>
                        <span
                            className={cn(
                                changeType(data.recent, data.total) === 'positive' ? 'bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20' : 
                                changeType(data.recent, data.total) === 'negative' ? 'bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20' :
                                'bg-neutral-100 text-neutral-800 ring-neutral-600/10 dark:bg-neutral-400/10 dark:text-neutral-500 dark:ring-neutral-400/20',
                                'inline-flex items-center bg-neutral-500 rounded-tremor-small px-2 py-1 text-tremor-label font-medium ring-1 ring-inset mt'
                            )}
                        >
                            {resolveChangeMessage(data.recent, data.total)}
                        </span>
                    </Box>
                </Box>
            ) : (
                <Box className='p-2 space-y-2'>
                    <Text size='1'>{data}</Text>
                </Box>
            )}
        </Card>
    );
});


StatCard.displayName = 'StatCard';

export default AllStats;

const SkeletonStatCard = () => {
    return (
        <Card variant='surface'>
            <Flex align='center' justify='between' className='p-2'>
                <div style={{ backgroundColor: '#444444', height: '20px', width: '200px', borderRadius: '5px' }} />
                <div style={{ backgroundColor: '#444444', height: '30px', width: '30px', borderRadius: '50%' }} />
            </Flex>
            <Box className='p-2 space-y-2'>
                <Box>
                    <Text size='1'>
                        <div style={{ backgroundColor: '#444444', height: '20px', width: '30%', borderRadius: '5px' }} />
                    </Text>
                </Box>
            </Box>
        </Card>
    );
};
