import {Button, Dialog} from "@radix-ui/themes";

import {projectCreateFormState} from "@/lib/store";
import ProjectCreateForm from "./form";

const ProjectCreateContent = () => {
    const {isOpen, setOpen} = projectCreateFormState();

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open: boolean
        ) => setOpen(open)}>
            <Dialog.Trigger>
                <Button
                    color={'lime'}
                    size={'2'}
                >Create Project</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{maxWidth: 450}}>
                <Dialog.Title>Create Project</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Create a new project.
                </Dialog.Description>
                <ProjectCreateForm/>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ProjectCreateContent;
