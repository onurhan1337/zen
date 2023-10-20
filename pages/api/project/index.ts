import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { name, status, startDate, endDate, description } = req.body;

    await prisma.project.create({
      data: {
        name,
        status,
        startDate,
        endDate,
        description,
        user: {
          connect: { id: "clniudf870000mm08o3flx27s" },
        },
      },
    });

    return new Response("Project created successfully", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error creating project", { status: 500 });
  }
}

// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(request: Request, res: Response) {
//   // Handle POST request
//   const cookie = request.headers.get("cookie");

//   if (!cookie) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const session = await res.json();
//   console.log("Session data:", session);
//   if (!session || !session.user || !session.user.email) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   try {
//     const data = await request.json();

//     const user = await prisma.user.findUnique({
//       where: { id: session },
//     });

//     if (!user) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const project = await prisma.project.create({
//       data: {
//         name: data.name,
//         status: data.status,
//         startDate: data.startDate,
//         endDate: data.endDate,
//         description: data.description,
//         user: {
//           connect: { id: user?.id },
//         },
//       },
//     });

//     let json_data = {
//       status: 201,
//       data: {
//         project,
//       },
//     };

//     return new NextResponse(JSON.stringify(json_data), {
//       status: 201,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error creating project:", error);
//     return new Response("Error creating project", { status: 500 });
//   }
// }
