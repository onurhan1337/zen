import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import getUser from '@/lib/utils/getUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const [totalProjects, recentProjects, totalTasks, recentTasks, projects] = await Promise.all([
      prisma.project.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.project.count({
        where: {
          userId: user.id,
          startDate: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.task.count({
        where: {
          project: {
            userId: user.id,
          },
        },
      }),
      prisma.task.count({
        where: {
          project: {
            userId: user.id,
          },
          startDate: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.project.findMany({
        where: {
          OR: [
            {
              members: {
                some: {
                  id: user.id,
                },
              },
            },
            {
              owners: {
                some: {
                  id: user.id,
                },
              },
            },
          ],
          startDate: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          members: true,
          owners: true,
        },
      }),
    ]);

    const userIds = projects.flatMap((project) => [
      ...project.members.map((member) => member.id),
      ...project.owners.map((owner) => owner.id),
    ]);

    const uniqueUserIds = new Set(userIds);

    const recentMembersOfProjects = uniqueUserIds.size;

    const totalMembersOfProjects = await prisma.project.count({
      where: {
        OR: [
          {
            members: {
              some: {
                id: user.id,
              },
            },
          },
          {
            owners: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
    });

    res.status(200).json({
      projects: {
        total: totalProjects,
        recent: recentProjects,
      },
      tasks: {
        total: totalTasks,
        recent: recentTasks,
      },
      members: {
        total: totalMembersOfProjects,
        recent: recentMembersOfProjects,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred.' });
  }
}
