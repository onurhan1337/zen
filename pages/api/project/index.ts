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
