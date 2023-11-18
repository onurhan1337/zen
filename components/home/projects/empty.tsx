import { FolderOpenIcon } from "lucide-react";

const ProjectsEmptyCard = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center text-center text-gray-500">
      <div
        className="mb-4 flex items-center justify-center rounded-full bg-gray-100 p-4"
        style={{ width: "fit-content" }}
      >
        <FolderOpenIcon size={48} color="gray" />
      </div>
      <div>You have no projects yet.</div>
    </div>
  );
};

export default ProjectsEmptyCard;
