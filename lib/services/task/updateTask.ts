import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import * as Yup from "yup";

import { TaskStatus } from "types/task";

export default async function updateTaskStatus(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const schema = Yup.object().shape({
    status: Yup.string().oneOf(Object.values(TaskStatus)).required(),
  });

  await schema.validate(req.body, { abortEarly: false });

  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const task = await prisma.task.update({
    where: {
      id: req.query.id as string,
    },
    data: {
      status,
    },
  });

  return res.status(200).json(task);
}
