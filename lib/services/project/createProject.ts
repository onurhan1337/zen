import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import * as Yup from "yup";

import getUser from "@/lib/utils/getUser";

export default async function createProject(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      status: Yup.string().required(),
      startDate: Yup.string().required(),
      endDate: Yup.string().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const { name, status, startDate, endDate, description } = req.body;

    if (!name || !status || !startDate || !endDate || !description) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        status,
        startDate,
        endDate,
        description,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json({
      project,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating project",
    });
  }
}
