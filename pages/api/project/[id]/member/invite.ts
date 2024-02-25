import {NextApiRequest, NextApiResponse} from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUser(req, res);

    if (!user) {
        return res.status(401).json({error: "Unauthorized"});
    }

    if (req.method === 'GET') {
        const {id} = req.query;

        // check is user owner of the project after getting the user
        const project = await prisma.project.findFirst({
            where: {
                id: id as string,
                owners: {
                    some: {
                        id: user.id,
                    },
                },
            },
        });

        if (!project) {
            return res.status(404).json({error: "Project not found"});
        }

        const pendingInvites = await prisma.projectInviteAttempt.findMany({
            where: {
                projectId: id as string,
            },
            include: {
                user: true,
            },
        });

        return res.json(pendingInvites);
    }

    if (req.method === "POST") {
        const {code, userId, projectId} = req.body;

        const project = await prisma.project.findFirst({
            where: {
                inviteCode: code,
            },
        });

        if (!project) {
            return res.status(404).json({error: "Project not found"});
        }

        await prisma.project.update({
            where: {id: projectId},
            data: {
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        // after adding the user to the project, delete the invite attempt
        await prisma.projectInviteAttempt.deleteMany({
            where: {
                projectId,
                userId,
            },
        });

        return res.status(200).json({message: "User sent a request to join the project"});
    }

    if (req.method === "DELETE") {
        const { userId, projectId } = req.body;

        const inviteAttempt = await prisma.projectInviteAttempt.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        if (!inviteAttempt) {
            return res.status(404).json({error: "Invite not found"});
        }

        await prisma.projectInviteAttempt.delete({
            where: {
                id: inviteAttempt.id,
            },
        });

        return res.status(200).json({message: "Invite deleted"});
    }
}
