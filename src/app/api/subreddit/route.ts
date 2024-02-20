import { getUserSession } from "@/lib/nextauth-options";
import { createSubredditValidator } from "@/lib/validators";
import { z } from "zod";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name } = await createSubredditValidator.parse(body);

    const existingSubreddit = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (existingSubreddit)
      return new Response("a subreddit with this name already exist", {
        status: 409,
      });

    const newSubreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session?.user?.id,
      },
    });

    await db.subscription.create({
      data: {
        subredditId: newSubreddit?.id,
        userId: session?.user?.id,
      },
    });

    return new Response(newSubreddit.name, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("invalid name input", { status: 422 });

    return new Response("Something went wrong, try again", { status: 400 });
  }
};
