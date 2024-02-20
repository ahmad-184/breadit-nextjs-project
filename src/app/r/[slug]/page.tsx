import { notFound } from "next/navigation";

import { getUserSession } from "@/lib/nextauth-options";
import { db } from "@/lib/db";
import MiniCreatePost from "@/components/MiniCreatePost";
import FeedPosts from "@/components/FeedPosts";
import { INFINIT_SCROLLING_PAGINATION_RESULT } from "@/config";

interface PageInterfaceProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params: { slug } }: PageInterfaceProps) {
  const session = await getUserSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          comments: true,
          votes: true,
          subreddit: true,
        },
        take: INFINIT_SCROLLING_PAGINATION_RESULT,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const postsCount = (await await db.post.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  })) as number;

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-medium text-zinc-800 mb-4">
        r/{subreddit?.name}
      </h1>
      <MiniCreatePost session={session} />
      {/* subreddit posts */}
      <FeedPosts
        initialPosts={subreddit.posts}
        subredditName={subreddit.name}
        postsCount={postsCount}
      />
    </>
  );
}
