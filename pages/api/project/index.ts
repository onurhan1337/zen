import { NextApiRequest, NextApiResponse } from "next";

import getUser from "@/lib/utils/getUser";
import createProject from "@/lib/services/project/createProject";
import { fetchAllProjects } from "@/lib/services/project/fetchProject";

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
    case "GET":
      return fetchAllProjects(req, res);
    case "POST":
      return createProject(req, res);

    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
