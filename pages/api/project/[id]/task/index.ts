import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
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

      const tasks = await prisma.task.findMany({
        where: {
          projectId: req.query.id as string,
        },
      });

      if (!tasks || tasks.length === 0) {
        res.status(200).json([]); // Return an empty array in the response object
      } else {
        res.status(200).json(tasks);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
