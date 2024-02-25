import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    if (!query) return new Response("Search query not found", { status: 404 });

    const data = await db.subreddit.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
      include: {
        _count: true,
      },
    });

    return Response.json(data, { status: 200 });
    // setTimeout(() => {
    // }, 3000);
  } catch (err) {
    return new Response("Someting went wront", { status: 500 });
  }
}
