interface BadgeProps {
  type: "active" | "inactive";
}

const Badge = ({ type = "active" }: BadgeProps) => {
  return (
    <>
      {type === "active" ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
          <svg
            className="h-1.5 w-1.5 fill-teal-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          ACTIVE
        </span>
      ) : (
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
          <svg
            className="h-1.5 w-1.5 fill-red-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          INACTIVE
        </span>
      )}
    </>
  );
};

export default Badge;
