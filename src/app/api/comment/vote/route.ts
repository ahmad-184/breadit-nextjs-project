import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { commentVoteValidator } from "@/lib/validators";
import { CommentVote } from "@prisma/client";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauhtorized", { status: 401 });

    const body = await req.json();

    const { commentId, voteType } = commentVoteValidator.parse(body);

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingVote) {
      const vote = (await db.commentVote.findFirst({
        where: {
          userId: session.user.id,
          commentId,
        },
      })) as CommentVote;

      if (vote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });

        return new Response("vote removed", { status: 200 });
      }

      await db.commentVote.update({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId,
          },
        },
        data: {
          type: voteType,
        },
      });

      return new Response("vote updated", { status: 200 });
    } else {
      await db.commentVote.create({
        data: {
          commentId,
          userId: session.user.id,
          type: voteType,
        },
      });

      return new Response("vote created", { status: 201 });
    }
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid input data", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
