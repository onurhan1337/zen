import { taskCreateFormState } from "@/lib/store";
import { Box, Button, Dialog } from "@radix-ui/themes";
import TaskCreateForm from "./form";

const TaskCreateContent = () => {
  const { isOpen, setOpen } = taskCreateFormState();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => setOpen(open)}>
      <Dialog.Trigger>
        <Button
          color={"blue"}
          variant={"classic"}
          onClick={() => setOpen(true)}
        >
          Create Task
        </Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Create Task</Dialog.Title>
        <Dialog.Description>
          Create a new task for this project.
        </Dialog.Description>
        <Box mt={"4"}>
          <TaskCreateForm />
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TaskCreateContent;
