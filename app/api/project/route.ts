import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  // Handle POST request
  const cookie = request.headers.get("cookie");
  const res = await fetch("http://localhost:3000/api/auth/session", {
    headers: {
      cookie: cookie!,
    },
  });
  if (!cookie) {
    return new Response("No cookie found", { status: 401 });
  }

  const session = await res.json();
  if (!session || !session.user || !session.user.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { name, status, startDate, endDate, description } =
      await request.json();

    if (!name || !status || !startDate || !endDate || !description) {
      return new Response("Missing fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        status,
        startDate,
        endDate,
        description,
        userId: user.id, // Assuming a direct foreign key relationship in your Prisma model
      },
    });

    return new Response(JSON.stringify(project), { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response("Error creating project", { status: 500 });
  }
}
