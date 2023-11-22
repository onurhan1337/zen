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
    }

    if (req.method === "POST") {
      try {
        const { name, startDate, endDate, status, description, projectId } =
          req.body;

        if (
          !name ||
          !startDate ||
          !endDate ||
          !status ||
          !description ||
          !projectId
        ) {
          return res.status(400).json({
            message: "Missing required fields",
          });
        }

        const projectID = await prisma.project.findUnique({
          where: {
            id: projectId,
          },
        });

        if (!projectID) {
          return res.status(400).json({
            message: "Project does not exist",
          });
        }

        const task = await prisma.task.create({
          data: {
            name,
            startDate,
            endDate,
            status,
            description,
            project: {
              connect: {
                id: projectID.id!,
              },
            },
          },
        });

        return res.status(201).json({
          task,
          message: "Task created successfully",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error creating task",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
