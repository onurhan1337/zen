import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Handle POST request
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { name, status, startDate, endDate, description } = req.body;

    if (!name || !status || !startDate || !endDate || !description) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        status,
        startDate,
        endDate,
        description,
        userId: user.id, // Assuming a direct foreign key relationship in your Prisma model
      },
    });

    return res.status(201).json({
      project,
      message: "Project created successfully",
      error: null,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
