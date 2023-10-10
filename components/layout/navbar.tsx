"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";

interface MenuProps {
  [key: string]: string;
}

const MENU: MenuProps = {
  "/": "home",
};

export default function NavBar({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const pathname = usePathname();

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <div className="inline-flex w-full items-center justify-start gap-8">
            <Link href="/" className="flex items-center font-display text-2xl">
              <Image
                src="/logo.png"
                alt="Zen logo"
                width="30"
                height="30"
                className="mr-2 rounded-sm"
              ></Image>
              <p>Zen</p>
            </Link>
            {session && (
              <nav className="flex flex-row items-center gap-4">
                {Object.entries(MENU).map(([key, value]) => {
                  const isActive = key === pathname;
                  return (
                    <button
                      className="text-sm font-medium leading-none"
                      key={key}
                    >
                      <Link href={key}>
                        {isActive ? (
                          <span className="font-semibold">{value}</span>
                        ) : (
                          value
                        )}
                      </Link>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
          <div>
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
