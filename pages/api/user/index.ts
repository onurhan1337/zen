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

    if (req.method === "DELETE") {
      // Get all projects associated with the user
      const projects = await prisma.project.findMany({
        where: {
          userId: session.user.id!,
        },
      });

      // Start a transaction
      await prisma.$transaction([
        // Delete tasks and projects associated with the user
        ...projects.map((project) =>
          prisma.task.deleteMany({
            where: {
              projectId: project.id,
            },
          }),
        ),
        prisma.project.deleteMany({
          where: {
            userId: session.user.id!,
          },
        }),

        // Delete the user
        prisma.user.delete({
          where: {
            email: session.user.email!,
          },
        }),
      ]);
      return res.status(201).json({
        message: "User deleted successfully",
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
