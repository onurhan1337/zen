import {Grid, Section} from "@radix-ui/themes";

import AllProjectsChart from "@/components/home/charts/all-projects";
import AssignedTasks from "@/components/home/charts/assigned-tasks";


const ChartsSection = () => {
    return (<Section>
        <Grid columns={{
            initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr'
        }} gap="3" width="auto"
        >
            <AllProjectsChart />
            <AssignedTasks/>
        </Grid>
    </Section>)
}

export default ChartsSection;
