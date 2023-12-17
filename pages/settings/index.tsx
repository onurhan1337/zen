import Head from "next/head";

import SettingsForm from "@/components/settings/form";
import { Suspense } from "react";
import { LoadingDots } from "@/components/shared/icons";
import { useSession } from "next-auth/react";
import { ShieldAlert, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SettingsIndex = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && (
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
      )}

      {!session && (
        <div className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-gray-400" />

          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You must be signed in to view this page
          </p>
          <div className="mt-6">
            <Link as={"a"} href="/">
              <Button variant={"action"}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsIndex;
