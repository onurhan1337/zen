import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export async function fetchAllTasks(req: NextApiRequest, res: NextApiResponse) {
  const tasks = await prisma.task.findMany({
    where: {
      projectId: req.query.id as string,
    },
    include: {
      assignee: true,
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
    include: {
      assignee: true,
    },
  });

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  } else {
    res.status(200).json(task);
  }
}

export async function fetchAllTasksOfUser(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { ownerId: user.id as string },
        { project: { members: { some: { id: user.id as string } } } },
      ],
    },
    include: {
      assignee: true,
    },
  });

  if (!tasks || tasks.length === 0) {
    res.status(200).json([]); // Return an empty array in the response object
  } else {
    res.status(200).json(tasks);
  }
}

export async function fetchAllTasksOfAssignedMember(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
) {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
    },
    include: {
      assignee: true,
    },
  });

  if (!tasks || tasks.length === 0) {
    res.status(200).json([]); // Return an empty array in the response object
  } else {
    res.status(200).json(tasks);
  }
}