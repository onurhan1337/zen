import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function deleteTask(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const task = await prisma.task.delete({
    where: {
      id: req.query.id as string,
    },
  });

  return res.status(200).json(task);
}
