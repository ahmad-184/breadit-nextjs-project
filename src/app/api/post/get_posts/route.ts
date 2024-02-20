import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { z } from "zod";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const session = await getUserSession();

    let folowedCommunityIds: string[] = [];

    if (session?.user) {
      const folowedComm = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          subreddit: true,
        },
      });

      folowedCommunityIds = folowedComm.map((comm) => comm.subreddit.id);
    }

    let where = {};

    const { subredditName, page, limit } = z
      .object({
        subredditName: z.string().nullish().optional(),
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        subredditName: url.searchParams.get("subredditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    if (subredditName) {
      where = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      where = {
        subreddit: {
          id: {
            in: folowedCommunityIds,
          },
        },
      };
    }

    const data = await db.post.findMany({
      where,
      include: {
        comments: true,
        votes: true,
        author: true,
        subreddit: true,
      },
      take: parseFloat(limit),
      skip: (parseFloat(page) - 1) * parseFloat(limit),
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid input data", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
