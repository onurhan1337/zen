import { LoadingDots } from "@/components/shared/icons";
import { Button, Dialog } from "@radix-ui/themes";
import { CommandIcon, CornerDownLeftIcon } from "lucide-react";

export default function SubmitButton({
  label,
  submitForm,
  isSubmitting,
  showShortcutIcons = true,
  ...props
}: {
  label?: string;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  showShortcutIcons?: boolean;
}) {
  const handleSubmit = () => {
    submitForm();
  };

  return (
    <Button
      size={"2"}
      type="submit"
      color={"blue"}
      radius={"full"}
      onClick={handleSubmit}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting ? (
        <LoadingDots color="#FFFFFF" />
      ) : (
        <>
          {showShortcutIcons && (
            <div
              className="inline-flex items-center justify-center space-x-1
              rounded-xl border border-zinc-200 px-2 py-1 text-xs
              "
            >
              <CommandIcon width="14" height="14" />
              <CornerDownLeftIcon width="14" height="14" />
            </div>
          )}
          <span>{label ? label : "Create"}</span>
        </>
      )}
    </Button>
  );
}

export const DialogCloseButton = ({ label = "Cancel" }: { label?: string }) => {
  return (
    <Dialog.Close>
      <Button
        color={"gray"}
        radius={"full"}
        variant={"outline"}
        aria-label={label}
      >
        {label}
      </Button>
    </Dialog.Close>
  );
};
