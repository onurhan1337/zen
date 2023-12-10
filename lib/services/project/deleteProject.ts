import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function deleteProject(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const projectId = req.query.id as string;

  if (!projectId) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  // Firstly -> delete the tasks associated with the project
  await prisma.task.deleteMany({
    where: {
      projectId: projectId,
    },
  });

  // Then -> delete the project
  const project = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return res.status(201).json({
    project,
    message: "Project deleted successfully",
  });
}
