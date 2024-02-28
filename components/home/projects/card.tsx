import {useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Box, Button, Card, Flex} from "@radix-ui/themes";
import {Project, ProjectStatus} from "types/project";

import {isUserOwner, truncate} from "@/lib/utils";
import ProjectStatusBadge from "@/components/home/projects/status-badge";
import {LoadingDots} from "@/components/shared/icons";
import DeleteConfirmationDialog from "@/components/projects/settings/confirm";

type Props = {
    project: Project;
};

const ProjectCard = ({project}: Props) => {
    const {data: session} = useSession();
    const [clicked, setClicked] = useState<boolean>(false);
    const {id, name, status, description, owners } = project;
    const router = useRouter();

    const isOwner =  isUserOwner(owners, session);

    return (<Card>
            <Flex
                align={'center'}
                justify={'between'}
                width={'100%'}
            >
                {// TODO: Active/Archived badge and Member badge are not same size and not aligned. Fix it.
                }
                <Flex
                    align={'center'}
                    justify={'between'}
                    width={'100%'}
                    pb={'2'}
                >
                    {status === ProjectStatus.ACTIVE ? (<ProjectStatusBadge type="active"/>) : (<ProjectStatusBadge type="archived"/>)}
                    {isOwner ? (<DeleteConfirmationDialog id={id} hasLabel={false}/>) : (<Box>
            <span
                className="inline-flex items-center rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-800  ring-1 ring-inset ring-green-200"
                title="Member"
            >
              MEMBER
            </span>
                        </Box>)}
                </Flex>
            </Flex>
            <Box py={'2'}>
                <h4 className="antialised scroll-m-20 text-lg font-medium tracking-tight md:subpixel-antialiased">
                    {truncate(name, 15)}
                </h4>
            </Box>
            <div className="py-2">
                <p className="antialised text-sm font-normal leading-7  md:subpixel-antialiased [&:not(:first-child)]:mt-6">
                    {truncate(description, 20)}
                </p>
            </div>
            <Box
                py={'2'}
            >
                <Button
                    onClick={() => {
                        setClicked(true);
                        router.push(`/projects/${id}`);
                    }}
                    color={"gray"}
                    disabled={clicked}
                    variant={"outline"}
                    className={'w-full'}
                >
                    {clicked ? <LoadingDots color="#808080"/> : "View Project"}
                </Button>
            </Box>
        </Card>);
};

export default ProjectCard;
