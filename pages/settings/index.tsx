import Head from "next/head";

import SettingsForm from "@/components/settings/form";
import { Suspense } from "react";
import { LoadingDots } from "@/components/shared/icons";
import { useSession } from "next-auth/react";
import { ShieldAlert } from "lucide-react";

const SettingsIndex = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <section className="flex w-full flex-col items-center">
          <div className="flex w-full max-w-screen-xl flex-row items-end justify-between border-b border-zinc-200 pb-4">
            <div>
              <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                Settings
              </h1>
            </div>
          </div>

          <Suspense fallback={<LoadingDots />}>
            <SettingsForm />
          </Suspense>
        </section>
      ) : (
        <div className=" flex w-full flex-col items-center justify-center">
          <ShieldAlert className="h-12 w-12 text-zinc-300" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-zinc-500 antialiased">
            You must be signed in to view this page
          </p>
        </div>
      )}
    </>
  );
};

export default SettingsIndex;
