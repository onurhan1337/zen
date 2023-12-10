import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export async function fetchUser(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prismaUser = await prisma.user.findUnique({
    where: {
      email: user.email!,
    },
  });

  if (!prismaUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ user: prismaUser });
}
