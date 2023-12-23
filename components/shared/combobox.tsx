import * as React from "react";
import { useFormikContext } from "formik";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Option {
  value: string;
  label: string;
  image: string;
}

interface ComboboxProps {
  onChange: (value: string) => void;
  options: Option[];
}

export const Combobox: React.FC<ComboboxProps> = ({ onChange, options }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);
  const { setFieldValue } = useFormikContext();

  console.log("options", options);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select member..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandEmpty>No User found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.label}
                value={option.value}
                onSelect={(value) => {
                  onChange(value);
                  setValue(value);
                  setFieldValue("userId", value);
                }}
                className="cursor-pointer"
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage
                    className="h-6 w-6"
                    src={option.image}
                    alt={option.value}
                  />
                  <AvatarFallback>{option.value}</AvatarFallback>
                </Avatar>
                {option.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
