import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { createCommentValidator } from "@/lib/validators";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { text, postId, replyToId } = createCommentValidator.parse(body);

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) return new Response("post not found", { status: 404 });

    await db.comment.create({
      data: {
        postId,
        text,
        userId: session.user.id,
        ...(replyToId && { replyToId }),
      },
    });

    return new Response("comment created", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid input data", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
