import Head from "next/head";
import {useSession} from "next-auth/react";

import HowItWorks from "@/components/layout/how-it-works";
import Cta from "@/components/layout/cta";
import Stats from "@/components/layout/stats";
import Footer from "@/components/layout/footer";
import ChartsSection from "@/components/home/charts";

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
                    <HowItWorks/>
                    <Stats/>
                    <Footer/>
                </section>
            )}
        </>);
}
