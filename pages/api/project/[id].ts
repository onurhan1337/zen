import { NextApiRequest, NextApiResponse } from "next";

import getUser from "@/lib/utils/getUser";
import { fetchProject } from "@/lib/services/project/fetchProject";
import updateProject from "@/lib/services/project/updateProject";
import deleteProject from "@/lib/services/project/deleteProject";

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
      return fetchProject(req, res);
    case "PUT":
      return updateProject(req, res);
    case "DELETE":
      return deleteProject(req, res);

    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
