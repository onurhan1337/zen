import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Suspense } from "react";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import { Theme } from "@radix-ui/themes";

import cx from "classnames";

export const metadata = {
  title: "Zen - Project management app",
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <Theme>
          <div className="fixed -z-10 h-screen w-full bg-white" />
          <Suspense fallback="...">
            <Nav />
          </Suspense>
          <main className="mx-5 py-32">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
