import { useSignInModal } from "./sign-in-modal";
import { useRouter } from "next/router";
import { Github } from "../shared/icons";
import { Button } from "../ui/button";

export default function Cta() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const router = useRouter();

  return (
    <div className="relative pt-14">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FB8B24] to-[#E36414] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Manage Your Projects Efficiently
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our project management system allows you to organize and track all
              your projects in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                onClick={() => setShowSignInModal(true)}
                variant={"action"}
                className="font-mono"
              >
                Get started
              </Button>
              <Button
                variant={"outline"}
                onClick={() =>
                  router.push("https://github.com/onurhan1337/zen")
                }
                className="font-mono text-sm font-semibold leading-6 text-gray-900"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SignInModal />
    </div>
  );
}
