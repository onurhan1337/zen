import {Analytics} from '@vercel/analytics/react';

import {Suspense} from "react";
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";
import type {AppProps} from "next/app";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import {Theme} from "@radix-ui/themes";
import NavBar from "@/components/layout/navbar";
import {Toaster} from "sonner";
import {Inter} from 'next/font/google'

const inter = Inter({
    subsets: ['latin']
})

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }: AppProps<{
    session: Session
}>) {
    return (
        <>
            <SessionProvider session={session}>
                <Theme
                    appearance={'dark'}
                >
                    <header>
                        <Suspense fallback="...">
                            <NavBar/>
                        </Suspense>
                    </header>
                    <main
                        className={`${inter.className} import mx-5 py-32`}
                    >
                        <Component {...pageProps} />
                    </main>
                    <Toaster richColors closeButton={true}/>
                </Theme>
            </SessionProvider>
            <Analytics/>
        </>
    );
}
