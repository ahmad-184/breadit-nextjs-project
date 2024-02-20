import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { redis } from "@/lib/redis";
import { postVoteValidator } from "@/lib/validators";
import { CachePostPayloadType } from "@/types/redis";
import { Vote } from "@prisma/client";
import { z } from "zod";

const CACH_AFTER_UPVOTES = 1;

export const PATCH = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauhtorized", { status: 401 });

    const body = await req.json();

    const { postId, voteType } = postVoteValidator.parse(body);

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });

    if (!post) return new Response("post not found", { status: 404 });

    if (existingVote) {
      const vote = (await db.vote.findFirst({
        where: {
          userId: session.user.id,
          postId,
        },
      })) as Vote;

      if (vote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
        });

        return new Response("vote removed", { status: 200 });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      });

      const votesAmount = post.votes.reduce((value, vote) => {
        if (vote.type === "UP") return value + 1;
        if (vote.type === "DOWN") return value - 1;
        return value;
      }, 0);

      if (votesAmount >= CACH_AFTER_UPVOTES) {
        const cachePayload: CachePostPayloadType = {
          id: post.id,
          title: post.title,
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          authorUsername: post.author.username || "",
        };

        await redis.hset(`post:${postId}`, cachePayload);
      }

      return new Response("vote updated", { status: 200 });
    } else {
      await db.vote.create({
        data: {
          postId,
          userId: session.user.id,
          type: voteType,
        },
      });

      const votesAmount = post.votes.reduce((value, vote) => {
        if (vote.type === "UP") return value + 1;
        if (vote.type === "DOWN") return value - 1;
        return value;
      }, 0);

      if (votesAmount >= CACH_AFTER_UPVOTES) {
        const cachePayload: CachePostPayloadType = {
          id: post.id,
          title: post.title,
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          authorUsername: post.author.username || "",
        };

        await redis.hset(`post:${postId}`, cachePayload);
      }

      return new Response("vote created", { status: 201 });
    }
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid input data", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
