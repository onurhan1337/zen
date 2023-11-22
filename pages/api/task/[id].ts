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
      const task = await prisma.task.findUnique({
        where: {
          id: req.query.id as string,
        },
      });

      if (!task) {
        res.status(404).json({ error: "Task not found" });
      } else {
        res.status(200).json(task);
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }

    if (req.method === "PUT") {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const task = await prisma.task.update({
        where: {
          id: req.query.id as string,
        },
        data: {
          status,
        },
      });

      return res.status(200).json(task);
    }

    if (req.method === "DELETE") {
      const task = await prisma.task.delete({
        where: {
          id: req.query.id as string,
        },
      });

      return res.status(200).json(task);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
