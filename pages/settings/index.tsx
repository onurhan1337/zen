import Head from "next/head";

import SettingsForm from "@/components/settings/form";
import { Suspense } from "react";
import { LoadingDots } from "@/components/shared/icons";

const SettingsIndex = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-screen-xl flex-row items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
        </div>

        <Suspense fallback={<LoadingDots />}>
          <SettingsForm />
        </Suspense>
      </section>
    </>
  );
};

export default SettingsIndex;
