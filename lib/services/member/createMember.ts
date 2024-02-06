import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import { EmailTemplate } from "@/components/projects/settings/emailTemplate";
import getUser from "@/lib/utils/getUser";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function createMember(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionUser = await getUser(req, res);
  const { id } = req.query;
  const { email } = req.body;

  try {
    // Validate input
    if (!email || !id) {
      return res
        .status(400)
        .json({ error: "User Email and Project ID are required" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: { members: true },
    });

    if (!project || !project.members) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is already a member
    const isMember = project.members.some((member) => member.id === email);

    if (isMember) {
      return res.status(400).json({ error: "User is already a member" });
    }

    const { data, error } = await resend.emails.send({
      from: sessionUser?.email || "",
      to: email,
      subject: "Hello world",
      text: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    console.log(data, error);

    res.status(200).json(data);
  } catch (error) {
    // Handle errors
    console.error("Error adding member to the project:", error);
    res.status(500).json({
      error: "An error occurred while adding the member to the project",
    });
  }
}
