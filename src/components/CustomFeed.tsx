import { db } from "@/lib/db";
import FeedPosts from "./FeedPosts";
import { INFINIT_SCROLLING_PAGINATION_RESULT } from "@/config";
import type { Session } from "next-auth";

export const revalidate = 15;

const CustomFeed = async ({ session }: { session: Session }) => {
  const folowedComm = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const initialPosts = await db.post.findMany({
    where: {
      subreddit: {
        id: {
          in: folowedComm.map((comm) => comm.subreddit.id),
        },
      },
    },
    take: INFINIT_SCROLLING_PAGINATION_RESULT,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      comments: true,
      author: true,
      subreddit: true,
    },
  });

  const postsCount = await db.post.count();

  return <FeedPosts initialPosts={initialPosts} postsCount={postsCount} />;
};

export default CustomFeed;
