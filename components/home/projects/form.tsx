"use client";

import { useState } from "react";

enum ProjectStatus {
  Active = "active",
  Inactive = "inactive",
}

const ProjectCreateForm = () => {
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Active);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ProjectStatus);
  };

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-5">
      <div className="relative col-span-2 mt-2 md:col-span-1">
        <label
          htmlFor="name"
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="relative col-span-2 mt-2 md:col-span-1">
        <label
          htmlFor="status"
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
        >
          Status
        </label>
        <select
          name="status"
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
        >
          {Object.entries(ProjectStatus).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="relative col-span-2 mt-2 md:col-span-1">
        <label
          htmlFor="start_date"
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
        >
          Start Date
        </label>
        <input
          type="date"
          name="start_date"
          id="start_date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="relative col-span-2 mt-2 md:col-span-1">
        <label
          htmlFor="end_date"
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
        >
          End Date
        </label>
        <input
          type="date"
          name="end_date"
          id="end_date"
          min={new Date().toISOString().slice(0, 10)}
          className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="relative col-span-2 mt-2">
        <label
          htmlFor="name"
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-zinc-900"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="block w-full resize-none rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
          rows={10}
        />
      </div>
    </div>
  );
};

export default ProjectCreateForm;
