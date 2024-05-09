import { cn } from "@/lib/utils";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { CSSProperties } from "react";
import GridPattern from "../shared/grid-pattern";
import { useSignInModal } from "./sign-in-modal";

export default function Cta() {
  const { SignInModal, setShowSignInModal } = useSignInModal();

  const SHIMMER_WIDTH = 100;

  return (
    <div className="relative sm:py-24 md:py-36 lg:py-52">
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [6, 6],
          [10, 5],
          [13, 3],
        ]}
        className={cn(
          "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[175%] skew-y-12",
        )}
      />
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <Link
          href={'https://github.com/onurhan1337/zen'}
          target="_blank"
          rel="noreferrer"
          passHref
          className={cn(
            "mx-auto max-w-md text-neutral-600/50 dark:text-neutral-400/50 ",
            "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
            "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
            "relative border inline-flex items-center gap-x-1 border-zinc-800 rounded-full px-3 py-1 text-sm leading-6 text-slate-600 cursor-pointer"
          )}
          style={
            {
              "--shimmer-width": `${SHIMMER_WIDTH}px`,
            } as CSSProperties
          }
        >
          <span>
            ✨
          </span>
          <p>Zen is open source now</p>
          <span>
            <span className="absolute inset-0" aria-hidden="true" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
          </span>
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl py-1 font-bold tracking-wide sm:text-6xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80">
            Simpler Way to <br />
            Manage <span
              className="text-transparent bg-clip-text bg-no-repeat bg-gradient-to-r from-transparent dark:via-blue-100/80 italic dark:via-blue-200/70 to-transparent dark:to-blue-300/80"
            >Projects</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Our project management system allows you to organize and <br /> track all
            your projects in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => setShowSignInModal(true)}
              size={"3"}
              radius="full"
              variant="classic"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>

      <SignInModal />
    </div>
  );
}