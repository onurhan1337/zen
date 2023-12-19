import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useSession } from "next-auth/react";
import { Button } from "@radix-ui/themes";

interface MenuProps {
  [key: string]: string;
}

const MENU: MenuProps = {
  "/": "home",
  "/projects": "projects",
  "/tasks": "tasks",
};

export default function NavBar() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const { pathname } = useRouter();
  const { data: session } = useSession();

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
            <Link href="/" className="font-display flex items-center text-2xl">
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
          {session ? (
            <UserDropdown />
          ) : (
            <Button
              radius={"full"}
              variant="surface"
              color={"gray"}
              onClick={() => setShowSignInModal(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
