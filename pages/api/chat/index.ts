import { NextApiRequest, NextApiResponse } from "next";

import getUser from "@/lib/utils/getUser";
import createProjectIdea from "@/lib/services/project/createProjectIdea";

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
            return createProjectIdea(req, res);

        default:
            res.status(405).json({ error: "Method not allowed" });
            break;
    }
}
