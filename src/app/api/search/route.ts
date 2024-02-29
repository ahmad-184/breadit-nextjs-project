import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    let option = {};
    if (query) {
      option = {
        where: {
          name: {
            mode: "insensitive",
            contains: query,
          },
        },
      };
    }

    const data = await db.subreddit.findMany({
      include: {
        _count: true,
      },
      ...option,
      orderBy: {
        Subscriber: {
          _count: "desc",
        },
      },
    });

    return Response.json(data, { status: 200 });
  } catch (err) {
    return new Response("Someting went wront", { status: 500 });
  }
}
