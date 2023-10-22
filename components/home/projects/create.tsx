import { Separator } from "@radix-ui/themes";
import { Drawer } from "vaul";
import { useDrawerStore } from "@/lib/store";
import ProjectCreateForm from "./form";

const ProjectCreateContent = () => {
  const { isOpen, setOpen } = useDrawerStore();

  return (
    <Drawer.Root open={isOpen} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 text-center font-medium">
                Create new Project
              </Drawer.Title>

              <Separator className="mb-4" />
              <ProjectCreateForm />
              <div>
                <Drawer.Close asChild>
                  <button
                    onClick={() => setOpen(false)}
                    className="mx-auto flex w-1/2 items-center justify-center rounded-md bg-transparent px-4 py-2 text-center text-zinc-500 hover:bg-zinc-300 hover:text-zinc-600"
                  >
                    Cancel
                  </button>
                </Drawer.Close>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ProjectCreateContent;
