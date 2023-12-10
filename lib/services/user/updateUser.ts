import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const schema = Yup.object().shape({
    name: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }

  const { name } = req.body;

  const prismaUser = await prisma.user.update({
    where: {
      email: user.email!,
    },
    data: {
      name,
    },
  });

  return res.status(201).json({
    user: prismaUser,
    message: "User updated successfully",
  });
}
