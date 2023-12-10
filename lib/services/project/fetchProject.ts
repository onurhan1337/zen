import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export async function fetchAllProjects(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
  });

  return res.status(200).json({ projects });
}

export async function fetchProject(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: {
      id: id as string,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  return res.status(200).json(project);
}
