import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const fetchAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return res.status(200).json(users);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return fetchAllUsers(req, res);
      return res.status(405).json({
        error: `${req.method} method not allowed`,
      });
  }
}
