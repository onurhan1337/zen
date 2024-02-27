import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";
import * as Yup from "yup";

import getUser from "@/lib/utils/getUser";

export default async function createTask(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const user = await getUser(req, res);

        if (!user) {
            return res.status(401).json({error: "Unauthorized"});
        }

        const {
            name,
            status,
            startDate,
            endDate,
            priority,
            assignedTo,
            description,
            projectId,
            assignToMe
        } = req.body;

        const schema = Yup.object().shape({
            name: Yup.string().required("Name is required"),
            status: Yup.string().required("Status is required"),
            startDate: Yup.string().required("Start date is required"),
            endDate: Yup.string().required("End date is required"),
            priority: Yup.string().required("Priority is required"),
            assignedTo: Yup.string().optional().nullable().default(null),
            description: Yup.string().required("Description is required"),
            projectId: Yup.string().required("Project ID is required"),
            assignToMe: Yup.boolean().optional().nullable().default(false)
        });

        await schema.validate(req.body, {abortEarly: false});

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            return res.status(400).json({
                message: "Project does not exist",
            });
        }

        const task = await prisma.task.create({
            data: {
                name,
                startDate,
                endDate,
                status,
                priority,
                assignee: assignToMe
                    ? {connect: {id: user.id!}}
                    : assignedTo
                        ? {connect: {id: assignedTo}}
                        : undefined,
                description,
                owner: {
                    connect: {
                        id: user.id!,
                    },
                },
                project: {
                    connect: {
                        id: project.id!,
                    },
                },
            },
        });

        return res.status(201).json({
            task,
            message: "Task created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error creating task",
        });
    }
}
