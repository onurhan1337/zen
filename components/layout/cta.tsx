import { useSignInModal } from "./sign-in-modal";
import { useRouter } from "next/router";
import { Github } from "../shared/icons";
import {Button} from "@radix-ui/themes";

export default function Cta() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const router = useRouter();

  return (
    <div className="relative pt-14">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-300 sm:text-6xl">
              Manage Your Projects Efficiently
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Our project management system allows you to organize and track all
              your projects in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                onClick={() => setShowSignInModal(true)}
                color={'lime'}
                size={'3'}
                variant={'classic'}
              >
                Get started
              </Button>
              <Button
                variant={'outline'}
                size={'3'}
                color={'gray'}
                onClick={() =>
                  router.push("https://github.com/onurhan1337/zen")
                }
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
