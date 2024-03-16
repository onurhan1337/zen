import React, {ReactNode} from "react";
import useSWR from "swr";
import {Box, Card, Flex, Heading, Text} from '@radix-ui/themes';
import {FolderCog2, ListChecks, UsersIcon} from 'lucide-react';

import fetcher from "@/lib/fetcher";

type Data = {
    projects: { recent: number, total: number };
    tasks: { recent: number, total: number };
    users: number;
};

const AllStats = () => {
    const {data} = useSWR<Data>('/api/project/stats', fetcher);

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
            <StatCard heading='Projects' data={data.projects} icon={<FolderCog2 className="w-4 h-4"/>}/>
            <StatCard heading='Tasks' data={data.tasks} icon={<ListChecks className="w-4 h-4"/>}/>
            <StatCard heading='Members' data={data.users} icon={<UsersIcon className="w-4 h-4"/>}/>
        </Box>
    );
}

const StatCard = React.memo(({heading, data, icon}: {heading: string, data: { recent: number, total: number } | number, icon: ReactNode}) => {
    const resolveData = (data: { recent: number, total: number } | number) => {
        if (typeof data === 'object') {
            return data.total;
        }
        return data;
    }

    function resolveRecent(recent: number, total: number) {
        if (total === 0) {
            return 'No data from last month';
        }

        const percentage = Math.floor((recent / total) * 100);
        let symbol = "";

        if (recent > total) {
            symbol = "+";
        } else if (recent < total) {
            symbol = "-";
        }

        return symbol + `${percentage}% from last month`;
    }

    return (
        <Card variant='surface'

        >
            <Flex align='center' justify='between' className='p-2'>
                <Heading as="h3" size='3' weight='bold'>{heading}</Heading>
                {icon}
            </Flex>
            <Box className='p-2 space-y-2'>
                <Box>
                    <Heading as="h1" size="8" weight="bold">{resolveData(data)}</Heading>
                </Box>
                <Box>
                    <Text size='1'>{typeof data === 'object' ? resolveRecent(data.recent, data.total) : null}</Text>
                </Box>
            </Box>
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