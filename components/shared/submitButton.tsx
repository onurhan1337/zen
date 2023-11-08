import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/shared/icons";
import { CommandIcon, CornerDownLeftIcon } from "lucide-react";

export default function SubmitButton({
  label,
  submitForm,
  isSubmitting,
  showShortcutIcons = true,
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
      className="flex w-full items-center justify-center space-x-2"
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <LoadingDots color="#FFFFFF" />
      ) : (
        <>
          {showShortcutIcons && (
            <div
              className="inline-flex items-center justify-center space-x-1
              rounded-lg border border-zinc-600 px-2 py-1 text-xs
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
