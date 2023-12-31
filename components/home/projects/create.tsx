import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Portal } from "@radix-ui/themes";

import { projectCreateFormState } from "@/lib/store";
import ProjectCreateForm from "./form";

const ProjectCreateContent = () => {
  const { isOpen, setOpen } = projectCreateFormState();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant={"action"}>Create Project</Button>
      </DialogTrigger>
      <Portal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>Create a new project.</DialogDescription>
          </DialogHeader>
          <ProjectCreateForm />
        </DialogContent>
      </Portal>
    </Dialog>
  );
};

export default ProjectCreateContent;
