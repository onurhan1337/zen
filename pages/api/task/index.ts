import { NextApiRequest, NextApiResponse } from "next";

import getUser from "@/lib/utils/getUser";
import createTask from "@/lib/services/task/createTask";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  switch (req.method) {
    case "POST":
      return createTask(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
