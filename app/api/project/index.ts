import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.method === "POST") {
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
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json({
      project,
      description: "Project created successfully",
      error: null,
    });
  }
}
