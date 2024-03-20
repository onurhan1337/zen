import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - 30);

  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  const taskCount = await prisma.task.count();

  const recentProjectCount = await prisma.project.count({
    where: {
      startDate: {
        gte: pastDate,
      },
    },
  });

  const recentTaskCount = await prisma.task.count({
    where: {
      startDate: {
        gte: pastDate,
      },
    },
  });

  res.json({
    users: userCount,
    projects: {
      total: projectCount,
      recent: recentProjectCount,
    },
    tasks: {
      total: taskCount,
      recent: recentTaskCount,
    },
  });
}
