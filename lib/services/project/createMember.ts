import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function createMember(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, projectId } = req.body;

  if (!userId || !projectId) {
    return res
      .status(400)
      .json({ error: "User ID and Project ID are required" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.members.some((member) => member.id === userId)) {
      return res
        .status(400)
        .json({ error: "User is already a member of the project" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { members: { connect: { id: userId } } },
    });

    res.status(200).json({ message: "Member added to project" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while adding the member to the project",
    });
  }
}
