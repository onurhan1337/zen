interface ProjectStatusBadgeProps {
    type: "active" | "archived";
}

const ProjectStatusBadge = ({ type = "active" }: ProjectStatusBadgeProps) => {
    const badgeColor = type === "active" ? "fill-teal-500" : "fill-red-500";
    const badgeText = type.toUpperCase();

    return (
        <span className="inline-flex items-center gap-x-1.5 leading-tight rounded-full px-2 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-zinc-200">
            <svg className={`h-1.5 w-1.5 ${badgeColor}`} viewBox="0 0 6 6" aria-hidden="true">
                <circle cx="3" cy="3" r="3" />
            </svg>
            {badgeText}
        </span>
    );
};

export default ProjectStatusBadge;