const HOW_IT_WORKS = [
  {
    name: "Create a project",
    description:
      "Create a project and add all the necessary information to get started.",
    step: "1",
  },
  {
    name: "Go to project details",
    description:
      "Invite your team members to collaborate on the project with you.",
    step: "2",
  },
  {
    name: "Add tasks",
    description:
      "Add tasks to your project and assign them to yourself or your team members(soon).",
    step: "3",
  },
  {
    name: "Just Drag and Drop the Tasks!",
    description:
      "Drag and drop the tasks to change their status and keep track of your progress.",
    step: "4",
  },
  {
    name: "Invite your team",
    description:
      "Invite your team members to collaborate on the project with you.",
    step: "5",
  },
  {
    name: "Start working",
    description:
      "Start working on your project and keep track of your progress.",
    step: "6",
  },
];

const HowItWorks = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            How to Use
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-300 sm:text-4xl">
            Everything you need to use{" "}
            <span className="inline-block text-clip bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent">
              Zen
            </span>
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Zen is a project management tool that helps you organize your
            projects and tasks in a simple way.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-zinc-300">
                  <div
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b hover:from-zinc-950 hover:via-zinc-950 hover:to-blue-900 bg-transparent border border-zinc-800 cursor-help" 
                  >
                    <span className="text-zinc-700">{h.step}</span>
                  </div>
                  {h.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-zinc-500">
                  {h.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
