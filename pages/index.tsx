import { useSession } from "next-auth/react";
import Head from "next/head";

import ChartsSection from "@/components/home/charts";
import Cta from "@/components/layout/cta";
import { FeatureList } from "@/components/layout/feature-list";
import Footer from "@/components/layout/footer";
import HowItWorks from "@/components/layout/how-it-works";
import Stats from "@/components/layout/stats";

export default function Home() {
    const {data: session} = useSession();

    return (<>
            <Head>
                <title>Zen</title>
                <meta name="description" content="Zen - Project Manager"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            {session && (
                    <ChartsSection/>
            )}

            {!session && (
                <section>
                    <Cta/>
                    <FeatureList/>
                    <HowItWorks/>
                    <Stats/>
                    <Footer/>
                </section>
            )}
        </>);
}
