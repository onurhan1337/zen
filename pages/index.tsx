import Head from "next/head";
import { useSession } from "next-auth/react";

import ProjectCreateContent from "@/components/home/projects/create";
import ProjectsCardList from "@/components/home/projects/list";
import HowItWorks from "@/components/layout/how-it-works";
import Cta from "@/components/layout/cta";
import Stats from "@/components/layout/stats";
import Footer from "@/components/layout/footer";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Zen</title>
        <meta name="description" content="Zen - Project Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session && (
        <div className="flex w-full justify-center">
          {/* TODO: Create here charts with using tremor. */}
          There is under construction.
        </div>
      )}

      {!session && (
        <section>
          <Cta />
          <HowItWorks />
          <Stats />
          <Footer />
        </section>
      )}
    </>
  );
}
