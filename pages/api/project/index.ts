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

    if (req.method === "POST") {
      try {
        const { name, status, startDate, endDate, description } = req.body;

        if (!name || !status || !startDate || !endDate || !description) {
          return res.status(400).json({
            message: "Missing required fields",
          });
        }

        const project = await prisma.project.create({
          data: {
            name,
            status,
            startDate,
            endDate,
            description,
            user: {
              connect: {
                email: session.user.email!,
              },
            },
          },
        });

        return res.status(201).json({
          project,
          message: "Project created successfully",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error creating project",
        });
      }
    }

    if (req.method === "GET") {
      try {
        const projects = await prisma.project.findMany({
          where: {
            userId: prismaUser.id,
          },
        });

        return res.status(201).json({
          projects,
          message: "Projects fetched successfully",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error fetching projects",
        });
      }
    }

    if (req.method === "DELETE") {
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({
            message: "Missing required fields",
          });
        }

        // Firstly -> delete the tasks associated with the project
        await prisma.task.deleteMany({
          where: {
            projectId: id,
          },
        });

        // Then -> delete the project
        const project = await prisma.project.delete({
          where: {
            id: id,
          },
        });

        return res.status(201).json({
          project,
          message: "Project deleted successfully",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error deleting project",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
