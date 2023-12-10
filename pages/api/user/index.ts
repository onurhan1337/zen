import { NextApiRequest, NextApiResponse } from "next";

import deleteUser from "@/lib/services/user/deleteUser";
import updateUser from "@/lib/services/user/updateUser";
import { fetchUser } from "@/lib/services/user/fetchUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return fetchUser(req, res);
    case "PUT":
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);
    default:
      return res.status(405).json({
        error: `${req.method} method not allowed`,
      });
  }
}
