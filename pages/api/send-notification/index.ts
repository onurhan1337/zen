import { sendTaskCreateSlackMessage } from "@/lib/slack";
import getUser from "@/lib/utils/getUser";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const task = req.body.task; 

  if (!task || typeof task !== 'object' || !task.name || !task.priority || !task.status) {
    return res.status(400).json({ error: "Complete task information is required" });
  }

  const messageText = `*Task Notification*\n*Task Name:* ${task.name}\n*Priority:* ${task.priority}\n*Status:* ${task.status}\n*Description:* ${task.description || 'No description provided'}\n<${task.link}|View Task>`;


try {
    const result = await sendTaskCreateSlackMessage({ text: messageText });
    if (result) {
        return res.status(200).json({ message: "Notification sent successfully" });
    } else {
        return res.status(500).json({ error: "Failed to send Slack message" });
    }


  } catch (error: any) {
    console.error("Error sending Slack message:", error.message);
    return res.status(500).json({ error: "Error sending Slack message" });
  }
}
