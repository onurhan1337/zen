import { Analytics } from "@vercel/analytics/react";

import NavBar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Theme } from "@radix-ui/themes";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  return (
    <>
      <SessionProvider session={session}>
        <Theme appearance={"dark"} className="antialiased">
          <header>
            <Suspense fallback="...">
              <NavBar />
            </Suspense>
          </header>
          <main className={`${inter.className} mx-5 py-24`}>
            <Component {...pageProps} />
          </main>
          <Toaster richColors closeButton={true} />
        </Theme>
      </SessionProvider>
      <Analytics />
    </>
  );
}
