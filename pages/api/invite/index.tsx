import {NextApiRequest, NextApiResponse} from "next";

import CreateInvite from "@/lib/services/invite/createInvite";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case "POST":
            return CreateInvite(req, res);
        default:
            return res.status(405).json({error: "Method not allowed"});
    }
}
