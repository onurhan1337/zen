import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mutate } from "swr";
import { toast } from "sonner";
import { TrashIcon, XCircleIcon } from "lucide-react";

import { Project } from "types/project";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/shared/icons";
import { useRouter } from "next/router";

const DeleteConfirmationDialog = ({
  id,
  hasLabel = false,
}: {
  id: string;
  hasLabel: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/project`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setOpen(false);

      if (hasLabel && res.ok) {
        router.push("/");
      }

      if (!res.ok) {
        throw new Error("Failed to delete the project");
      }

      mutate(
        "/api/project",
        (data: Project[] | undefined) => {
          if (Array.isArray(data)) {
            const updatedData = data.filter((project) => project.id !== id);
            return updatedData;
          }

          return data; // Return unchanged if data is not an array
        },
        true, // Revalidate the data
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      aria-label="Delete project"
    >
      <DialogTrigger asChild>
        {hasLabel ? (
          <Button className="w-full" variant="destructive">
            Delete this Project
          </Button>
        ) : (
          <Button variant="ghost" color="red">
            <TrashIcon size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex w-full items-center justify-between gap-2">
          <XCircleIcon color="#EF4444" size={24} />
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onDelete()}
            variant={"destructive"}
            disabled={loading}
          >
            {loading ? <LoadingDots color="#FFFFFF" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
