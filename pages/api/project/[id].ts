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
      const project = await prisma.project.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          tasks: true,
        },
      });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(project);
    }

    if (req.method === "PUT") {
      const { name, description, status } = req.body;

      if (name) {
        const project = await prisma.project.update({
          where: {
            id: req.query.id as string,
          },
          data: {
            name,
          },
        });

        return res.status(201).json({
          project,
          message: "Project updated successfully",
        });
      }

      if (description) {
        const project = await prisma.project.update({
          where: {
            id: req.query.id as string,
          },
          data: {
            description,
          },
        });

        return res.status(201).json({
          project,
          message: "Project updated successfully",
        });
      }

      if (status) {
        await prisma.project.update({
          where: {
            id: req.query.id as string,
          },
          data: {
            status,
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
