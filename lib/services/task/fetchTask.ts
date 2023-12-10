import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export async function fetchAllTasks(req: NextApiRequest, res: NextApiResponse) {
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

export async function fetchTask(req: NextApiRequest, res: NextApiResponse) {
  const task = await prisma.task.findUnique({
    where: {
      id: req.query.id as string,
    },
  });

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  } else {
    res.status(200).json(task);
  }
}