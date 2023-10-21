import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Suspense } from "react";
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
        <main className="mx-5 py-32">
          <Component {...pageProps} />
        </main>
        <Toaster
          richColors
          toastOptions={{
            style: {
              zIndex: "99999999",
            },
          }}
        />
      </Theme>
    </SessionProvider>
  );
}
