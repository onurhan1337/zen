import useMediaQuery from "@/lib/hooks/use-media-query";
import useScroll from "@/lib/hooks/use-scroll";
import { Button } from "@radix-ui/themes";
import { FolderArchive, Home } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import FolderCode from "../shared/icons/folder-code";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export interface MenuProps {
  [key: string]: {
    label: string;
    icon: JSX.Element;
  };
}

const MENU: MenuProps = {
  "/": { label: "Home", icon: <Home className="h-4 w-4" /> },
  "/projects": {
    label: "Projects",
    icon: <FolderCode className="h-4 w-4" />,
  },
  "/tasks": { label: "Tasks", icon: <FolderArchive className="h-4 w-4" /> },
};

export default function NavBar() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const { isMobile } = useMediaQuery();

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-zinc-800 bg-transparent/10 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent/0 backdrop-blur-0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <div className="inline-flex w-full items-center justify-start gap-8">
            <Link href="/" className="font-display flex items-center text-2xl">
              <Image
                src="/logo.svg"
                alt="Zen logo"
                width={36}
                height={36}
                className="mr-2 rounded-sm"
              />
              <p>Zen</p>
            </Link>
            {session && !isMobile && (
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
                          <span className="font-semibold">{value.label}</span>
                        ) : (
                          value.label
                        )}
                      </Link>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
          {session ? (
            <UserDropdown navItems={MENU} />
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
