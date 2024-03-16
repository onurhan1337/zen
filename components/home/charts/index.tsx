import {Container, Flex, Section} from "@radix-ui/themes";

import AllProjectsChart from "@/components/home/charts/all-projects";
import AssignedTasks from "@/components/home/charts/assigned-tasks";
import AllStats from "./all-stats";


const ChartsSection = () => {
    return (<Section
        className="w-full max-w-7xl mx-auto "
    >
        <Flex   
            direction={'column'}
            gap={'5'}
        >
            <AllStats />
            <Flex
                direction={{initial: 'column', md: 'row'}}
                gap={'5'}
                width={'100%'}
            >
            <AllProjectsChart />
            <AssignedTasks/>
            </Flex>
        </Flex>
    </Section>
    )
}

export default ChartsSection;
