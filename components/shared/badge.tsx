interface BadgeProps {
  id: number;
  text: string;
  hasCloseButton?: boolean;
  onRemove?: (id: number) => void;
}

const Badge = ({ id, text, hasCloseButton = false, onRemove }: BadgeProps) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <span className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
      {text}
      {hasCloseButton && (
        <button
          type="button"
          onClick={handleRemove}
          className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20"
        >
          <span className="sr-only">Remove</span>
          <svg
            viewBox="0 0 14 14"
            className="h-3.5 w-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75"
          >
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
          <span className="absolute -inset-1" />
        </button>
      )}
    </span>
  );
};

export default Badge;
