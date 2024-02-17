import { NextApiRequest, NextApiResponse } from "next";

const generateInviteCode = (projectId: string): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 8;
  let inviteCode = projectId + "_";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteCode += characters[randomIndex];
  }
  return "https://zen-orcin.xyz/api/invite?code=" + inviteCode;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Extract projectId from the URL path
      const { id } = req.query;

      // Generate a unique invite code
      const inviteCode = generateInviteCode(id as string);

      // Assuming you want to store the invite code in a database or somewhere else
      // For now, just return the invite code as a response
      res.status(200).json({ inviteCode });
    } catch (error) {
      console.error("Error generating invite code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
