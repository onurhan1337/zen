import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, streamToResponse } from "ai";
import OpenAI from "openai";

import getUser from "@/lib/utils/getUser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export default async function createProjectIdea(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { messages } = await req.body;

  if (!messages) {
    return res.status(400).json({
      message: "Interest is required",
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Generate project ideas based on a user's interests. The user provides a list of their interests, hobbies, or areas of expertise, and the AI generates project ideas tailored to those interests. The project ideas should be creative, feasible, and diverse, covering a range of domains such as technology, arts, education, health, and more. Each project idea should include a brief description, key features, target audience, and potential impact. The goal is to inspire the user with project ideas that they are passionate about and motivated to pursue. The AI should leverage natural language generation to provide personalized and insightful project suggestions.",
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return streamToResponse(stream, res);
}
