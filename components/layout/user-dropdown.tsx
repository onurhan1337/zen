import { LogOut, Plus, Settings } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import FindProjectIdea from "@/components/home/projects/find-project-idea";
import JoinExistingProject from "@/components/projects/join-existing-project";
import Sparkles from "@/components/shared/icons/sparkles";
import Popover from "@/components/shared/popover";
import fetcher from "@/lib/fetcher";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { MenuProps } from "./navbar";

interface UserDropdownProps {
  navItems: MenuProps;
}

export default function UserDropdown({ navItems }: UserDropdownProps) {
  const router = useRouter();
  const { data: session } = useSWR<Session>("/api/auth/session", fetcher);
  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
  const [openAskToAIModal, setOpenAskToAIModal] = useState<boolean>(false);
  const { email, image } = session?.user || {};
  const [openPopover, setOpenPopover] = useState(false);
  const { isMobile } = useMediaQuery();

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-zinc-900 p-2 sm:w-56">
            <div className="p-2">
              {session?.user?.name && (
                <p className="truncate text-sm font-medium text-zinc-300">
                  {session?.user?.name}
                </p>
              )}
              <p className="truncate text-sm text-zinc-500">
                {session?.user?.email}
              </p>
            </div>
            <button
              className={
                "relative mb-2 flex w-full items-center justify-start space-x-2 rounded-md bg-purple-950/30 p-2 text-left text-sm text-purple-400 transition-all duration-75 hover:bg-purple-950/40 hover:text-purple-300"
              }
              onClick={() => {
                setOpenAskToAIModal(true);
              }}
            >
              <Sparkles className="h-4 w-4" />
              <p className="text-sm">Find project idea</p>
            </button>
            <button
              className={
                "relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-zinc-700"
              }
              onClick={() => {
                setOpenInviteModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <p className="text-sm">Join existing project</p>
            </button>
            {/* 
              device is mobile, show the nav items
            */}
            {isMobile &&
              Object.entries(navItems).map(([key, value]) => {
                return (
                  <button
                    key={key}
                    className={
                      "relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-zinc-700"
                    }
                    onClick={() => {
                      router.push(key);
                    }}
                  >
                    {value.icon}
                    <p className="text-sm">{value.label}</p>
                  </button>
                );
              })}
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-zinc-700"
              onClick={() => {
                router.push("/settings");
              }}
            >
              <Settings className="h-4 w-4" />
              <p className="text-sm">Settings</p>
            </button>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-zinc-700"
              onClick={() =>
                signOut({
                  redirect: false,
                }).then(() => {
                  router.push("/");
                })
              }
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
          />
        </button>
      </Popover>
      <FindProjectIdea
        isOpen={openAskToAIModal}
        onClose={() => {
          setOpenAskToAIModal(false);
        }}
        userAvatar={session?.user.image || ""}
      />
      <JoinExistingProject
        isOpen={openInviteModal}
        onClose={() => {
          setOpenInviteModal(false);
        }}
      />
    </div>
  );
}
