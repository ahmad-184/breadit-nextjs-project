import { db } from "@/lib/db";
import FeedPosts from "./FeedPosts";
import { INFINIT_SCROLLING_PAGINATION_RESULT } from "@/config";

export const revalidate = 15;

const GeneralFeed = async () => {
  const initialPosts = await db.post.findMany({
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

export default GeneralFeed;
