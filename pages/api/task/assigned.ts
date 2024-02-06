import {NextApiRequest, NextApiResponse} from "next";

import getUser from "@/lib/utils/getUser";
import {fetchAllTasksOfAssignedMember} from "@/lib/services/task/fetchTask";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const user = await getUser(req, res);

    if (!user) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    switch (req.method) {
        case "GET":
            return fetchAllTasksOfAssignedMember(req, res, user.id);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}