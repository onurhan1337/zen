import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

import SettingsForm from "@/components/settings/form";

const SettingsIndex = ({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
  };
}) => {
  console.log("bu settings dosyası içindeki user: ", user);

  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-screen-xl flex-row items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
        </div>
        <SettingsForm user={user} />
      </section>
    </>
  );
};

export default SettingsIndex;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  };
};
