import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function fetchMembers(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: { members: true, owners: true, },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!project.members && !project.owners) {
      return res.status(200).json([]);
    }

    res.status(200).json({ members: project.members, owners: project.owners, inviteCode: project.inviteCode });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the project members" });
  }
}
