import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { createPostValidator } from "@/lib/validators";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { subredditId, title, content } = await createPostValidator.parse(
      body
    );

    const subredditExist = await db.subreddit.findFirst({
      where: {
        id: subredditId,
      },
    });

    if (!subredditExist)
      return new Response("Subreddit dos not exist", { status: 400 });

    const existPostWithSameTitle = await db.post.findFirst({
      where: {
        title: title,
      },
    });

    if (existPostWithSameTitle)
      return new Response("There is a post with this title", { status: 409 });

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id,
      },
    });

    return new Response("Post created successfully", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid input data", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
