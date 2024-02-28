import {NextApiRequest, NextApiResponse} from "next";

import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export default async function DisconnectFromProject(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const user = await getUser(req, res);

    if (!user) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    try {
        const { userId, projectId } = req.body;

        if (!userId || !projectId) {
            return res.status(400).json({
                error: "Missing required fields",
            });
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            return res.status(404).json({
                error: "Project not found",
            });
        }

        // TODO: When Owner and admin will be extracted from the project, check if the user is the owner. If yes, then don't allow to disconnect.

        const isMember = await prisma.project.findFirst({
            where: {
                id: projectId,
            },
            select: {
                members: {
                    where: {
                        id: userId,
                    },
                },
            },
        });

        if (!isMember) {
            return res.status(403).json({
                error: "You are not a member of this project",
            });
        }

        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                members: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
        });

        return res.status(201).json(
            {
                message: "Successfully disconnected from the project",
            }
        );
    } catch
        (error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Error creating project",
        });
    }
}
