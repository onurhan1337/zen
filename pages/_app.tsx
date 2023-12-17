import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import NavBar from "@/components/layout/navbar";
import { Toaster } from "sonner";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Theme>
        <header>
          <Suspense fallback="...">
            <NavBar />
          </Suspense>
        </header>
        <main
          className={`${GeistSans.variable} ${GeistMono.variable} import mx-5 py-32 font-sans`}
        >
          <Component {...pageProps} />
        </main>
        <Toaster richColors closeButton={true} />
      </Theme>
    </SessionProvider>
  );
}
