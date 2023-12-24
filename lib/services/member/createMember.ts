import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function createMember(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const { userId } = req.body;

  try {
    // Validate input
    if (!userId || !id) {
      return res
        .status(400)
        .json({ error: "User ID and Project ID are required" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: { members: true },
    });

    if (!project || !project.members) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is already a member
    if (
      project.members.some((member: { id: string }) => member.id === userId)
    ) {
      return res
        .status(400)
        .json({ error: "User is already a member of the project" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add user as a member to the project
    await prisma.project.update({
      where: { id: id as string },
      data: { members: { connect: { id: userId } } },
    });

    // Respond with success message
    res.status(200).json({ message: "Member added to the project" });
  } catch (error) {
    // Handle errors
    console.error("Error adding member to the project:", error);
    res.status(500).json({
      error: "An error occurred while adding the member to the project",
    });
  }
}
