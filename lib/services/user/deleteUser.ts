import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export default async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id!,
    },
  });

  // Start a transaction
  await prisma.$transaction([
    // Delete tasks and projects associated with the user
    ...projects.map((project) =>
      prisma.task.deleteMany({
        where: {
          projectId: project.id,
        },
      }),
    ),
    prisma.project.deleteMany({
      where: {
        userId: user.id!,
      },
    }),

    // Delete the user
    prisma.user.delete({
      where: {
        email: user.email!,
      },
    }),
  ]);
  return res.status(201).json({
    message: "User deleted successfully",
  });
}
