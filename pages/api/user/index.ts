import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const prismaUser = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!prismaUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email!,
        },
      });

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      res.status(200).json({ user });
    }

    if (req.method === "PUT") {
      const { name, email } = req.body;

      if (name && !email) {
        const user = await prisma.user.update({
          where: {
            email: session.user.email!,
          },
          data: {
            name: name,
          },
        });

        return res.status(201).json({
          user,
          message: "User updated successfully",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
