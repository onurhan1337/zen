import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function deleteMember(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const projectId = req.query.id as string;

  const { userId } = req.body;

  if (!projectId) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  // delete member from project
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  return res.status(200).json({
    project,
    message: "Member deleted successfully",
  });
}
