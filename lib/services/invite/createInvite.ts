import {NextApiRequest, NextApiResponse} from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

/**
 * API handler for adding a user to a project.
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */
export default async function CreateInvite(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await getUser(req, res);

    if (!user || !user.name || !user.email) {
        return res.status(401).json({error: "User is not authenticated"});
    }

    const {code} = req.body;

    if (!code || typeof code !== "string") {
        return res.status(400).json({error: "Invalid invite code"});
    }

    const project = await prisma.project.findUnique({
        where: {
            inviteCode: code
        },
        include: {
            members: true,
            owners: true
        }
    });

    if (!project) {
        return res.status(404).json({error: "Project not found"});
    }

    const isMember = project.members.some(member => member.id === user.id);
    const isOwner = project.owners.some(owner => owner.id === user.id);

    if (isMember || isOwner) {
        return res.status(400).json({error: "User is already a member of the project"});
    }

    const pendingInvite = await prisma.projectInviteAttempt.findFirst({
        where: {
            projectId: project.id,
            userId: user.id
        }
    });

    if (pendingInvite) {
        return res.status(400).json({error: "User has already sent a request to join the project"});
    }

    await prisma.projectInviteAttempt.create({
        data: {
            name: user.name,
            email: user.email,
            projectId: project.id,
            userId: user.id
        }
    });

    return res.status(200).json({message: "User sent a request to join the project"});
}