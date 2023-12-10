import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import * as Yup from "yup";

import { ProjectStatus } from "types/project";

export default async function updateProject(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const schema = Yup.object().shape({
    name: Yup.string(),
    status: Yup.string().oneOf(Object.values(ProjectStatus)),
    description: Yup.string(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }

  const { name, description, status } = req.body;

  if (!name && !description && !status) {
    return res.status(400).json({
      message: "At least one of 'name', 'description', or 'status' is required",
    });
  }

  const projectUpdateData = {
    ...(name && { name }),
    ...(description && { description }),
    ...(status && { status }),
  };

  const project = await prisma.project.update({
    where: {
      id: req.query.id as string,
    },
    data: projectUpdateData,
  });

  return res.status(201).json({
    project,
    message: "Project updated successfully",
  });
}
