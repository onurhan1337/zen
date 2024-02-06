import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import getUser from "@/lib/utils/getUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getUser(req, res)

    if (!session) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);

    const userCount = await prisma.user.count({
        where: {
            id: session.id,
        },
    });

    const projectCount = await prisma.project.count({
        where: {
            userId: session.id,
        },
    });

    const taskCount = await prisma.task.count({
        where: {
            projectId: {
                in: await prisma.project.findMany({
                    where: {
                        userId: session.id,
                    },
                    select: {
                        id: true,
                    },
                }).then(projects => projects.map(project => project.id)),
            },
        },
    });

    const recentProjectCount = await prisma.project.count({
        where: {
            userId: session.id,
            startDate: {
                gte: pastDate,
            },
        },
    });

    const recentTaskCount = await prisma.task.count({
        where: {
            projectId: {
                in: await prisma.project.findMany({
                    where: {
                        userId: session.id,
                        startDate: {
                            gte: pastDate,
                        },
                    },
                    select: {
                        id: true,
                    },
                }).then(projects => projects.map(project => project.id)),
            },
        },
    });

    // Fetch projects with their tasks
    const projects = await prisma.project.findMany({
        where: {
            userId: session.id,
        },
        select: {
            name: true,
            tasks: true,
        },
    });

    res.json({
        users: userCount,
        projects: {
            total: projectCount,
            recent: recentProjectCount,
            data: projects, // Add projects data to the response
        },
        tasks: {
            total: taskCount,
            recent: recentTaskCount,
        },
    });
}