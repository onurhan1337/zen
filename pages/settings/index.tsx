import {Suspense} from "react";
import Head from "next/head";
import {useSession} from "next-auth/react";

import SettingsForm from "@/components/settings/form";
import {LoadingDots} from "@/components/shared/icons";

const SettingsIndex = () => {
    const {data: session} = useSession();

    return (
        <>
            <Head>
                <title>Settings</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            {session && (
                <section className="flex w-full flex-col items-center">
                    <div
                        className="flex w-full max-w-screen-xl flex-row items-end justify-between border-b border-zinc-600 pb-4">
                        <div>
                            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                                Settings
                            </h1>
                        </div>
                    </div>

                    <Suspense fallback={<LoadingDots/>}>
                        <SettingsForm/>
                    </Suspense>
                </section>
            )}

            {!session && (
                <LoginForSeeSettings/>
            )}
        </>
    );
};

export default SettingsIndex;

const LoginForSeeSettings = () => {
    return (
        <div className="flex w-full max-w-screen-xl items-center justify-between">
            <div className="inline-flex w-full flex-col items-start justify-center gap-8">
                <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
                    Settings
                </h1>
                <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
                    <p className="text-lg font-medium tracking-tight text-gray-600">
                        You must be{" "}
                        <span className="underline underline-offset-4">logged in</span> to
                        see your settings.
                    </p>
                    <p className="text-lg font-medium tracking-tight text-gray-600">
                        If you don&apos;t have an account, you can register by clicking the
                        button at the top right.
                    </p>
                </div>
            </div>
        </div>
    );
}