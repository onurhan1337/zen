import { Button } from "@radix-ui/themes";
import ProjectsCardList from "./projects/list";

const Hero = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-screen-xl items-center justify-between">
        <div className="inline-flex w-full flex-col items-start justify-center gap-8">
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
              Projects
            </h1>
            <Button variant="classic">Create Project</Button>
          </div>
          <ProjectsCardList />
        </div>
      </div>
    </div>
  );
};

export default Hero;
