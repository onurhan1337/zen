

import getUser from '@/lib/utils/getUser';
import prisma  from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req, res);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      select: {
        name: true,
        _count: {
          select: { tasks: true, members: true, owners: true }
        }
      },
    });

    const transformedProjects = projects.map(project => ({
      name: project.name,
      tasks: project._count.tasks,
      members: project._count.members + project._count.owners,
    }));

    return res.status(200).json(transformedProjects);


  } catch (error) {
    res.status(500).json({ message: 'An error occurred.' });
  }
}

