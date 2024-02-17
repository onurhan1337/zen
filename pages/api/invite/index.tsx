import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler for adding a user to a project.
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Extract the invite code from the query parameters
      const { code } = req.query;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Invalid invite code" });
      }

      // Validate the invite code and extract the project ID
      const projectId = code.split("_")[0];

      // Find the project associated with the invite code
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Get the user from the request
      const user = await getUser(req, res);

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Add the user to the project
      await prisma.project.update({
        where: { id: projectId },
        data: { members: { connect: { id: user.id } } },
      });

      // Redirect to the project page
      return res.redirect(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error adding user to project:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // If the request method is not GET, return an error
  return res.status(405).json({ error: "Method Not Allowed" });
}
