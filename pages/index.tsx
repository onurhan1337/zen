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
          <div className="flex w-full max-w-screen-xl items-center justify-between">
            <div className="inline-flex w-full flex-col items-start justify-center gap-8">
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">
                  Projects
                </h1>
                <ProjectCreateContent />
              </div>
              <ProjectsCardList />
            </div>
          </div>
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
