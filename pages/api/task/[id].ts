import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";
import deleteTask from "@/lib/services/task/deleteTask";
import { fetchTask } from "@/lib/services/task/fetchTask";
import updateTaskStatus from "@/lib/services/task/updateTask";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  switch (req.method) {
    case "GET":
      return await fetchTask(req, res);
    case "PUT":
      // TODO: If write task update logic here, change function to updateTask
      return await updateTaskStatus(req, res);
    case "DELETE":
      return await deleteTask(req, res);
    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }

  if (req.method === "DELETE") {
    const task = await prisma.task.delete({
      where: {
        id: req.query.id as string,
      },
    });

    return res.status(200).json(task);
  }
}
