import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { joinLeaveCommPayloadValidator } from "@/lib/validators";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { subredditId } = await joinLeaveCommPayloadValidator.parse(body);

    const subscriptionExist = await db.subscription.findFirst({
      where: {
        subreddit: {
          id: subredditId,
        },
        user: {
          id: session.user.id,
        },
      },
    });

    if (Boolean(subscriptionExist)) {
      const isUserOwnSubreddit = await db.subreddit.findFirst({
        where: {
          creatorId: session.user.id,
        },
      });

      if (Boolean(isUserOwnSubreddit))
        return new Response(
          "You can not subscribe or unsubscribe your own subreddi",
          {
            status: 400,
          }
        );
    }

    if (Boolean(subscriptionExist)) {
      await db.subscription.delete({
        where: {
          userId_subredditId: {
            subredditId,
            userId: session.user.id,
          },
        },
      });

      return new Response("LEAVED", { status: 200 });
    } else {
      await db.subscription.create({
        data: {
          subredditId,
          userId: session.user.id,
        },
      });

      return new Response("JOINED", { status: 200 });
    }
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid subreddit id", { status: 422 });

    return new Response("Something went wrong, try again", { status: 500 });
  }
};
