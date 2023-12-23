import { NextApiRequest, NextApiResponse } from "next";

import { fetchMembers } from "@/lib/services/project/fetchMember";
import createMember from "@/lib/services/project/createMember";
import getUser from "@/lib/utils/getUser";

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
      return await fetchMembers(req, res);
    case "POST":
      return await createMember(req, res);
    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
