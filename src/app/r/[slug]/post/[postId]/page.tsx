import { Suspense } from "react";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CachePostPayloadType } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import Icons from "@/components/Icons";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput";
import CommentsSection from "@/components/CommentsSection";

interface PageProps {
  params: {
    postId: string;
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const PostVoteShell = () => {
  return (
    <div className="flex flex-row md:flex-col gap-2 items-center mt-5">
      <Skeleton className="w-8 h-9 rounded-md" />
      <div className="flex justify-center w-full">
        <Icons.loader className="animate-spin spin-in-3 w-5" />
      </div>
      <Skeleton className="w-8 h-9 rounded-md" />
    </div>
  );
};

const Page = async ({ params }: PageProps) => {
  const { postId, slug: subredditName } = params;

  const cachedPost = (await redis.hgetall(
    `post:${postId}`
  )) as CachePostPayloadType;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  const voteComponent = (
    <Suspense fallback={<PostVoteShell />}>
      <PostVoteServer
        postId={postId}
        subredditName={subredditName}
        getData={async () => {
          return await db.post.findUnique({
            where: {
              id: post?.id || postId,
            },
            include: {
              votes: true,
            },
          });
        }}
      />
    </Suspense>
  );

  return (
    <div className=" w-full">
      <div className="mb-7">
        <div className="flex gap-2 sm:gap-6">
          <div className="hidden md:block">{voteComponent}</div>
          <div className="flex flex-col flex-grow gap-5 rounded-md p-4 bg-white shadow">
            <div className="flex flex-col gap-1 w-full">
              <div>
                <span className="text-zinc-500 text-xs font-medium mr-1">
                  Posted by u/
                  {post?.author.username ?? cachedPost.authorUsername}
                </span>
                {" - "}
                <span className="text-zinc-500 text-xs font-medium">
                  {formatTimeToNow(
                    new Date(post?.createdAt ?? cachedPost.createdAt)
                  )}
                </span>
              </div>
              <h1 className="font-semibold text-2xl text-zinc-900 mb-2">
                {post?.title ?? cachedPost.title}
              </h1>

              <div className="max-w-full w-full">
                <EditorOutput content={post?.content ?? cachedPost.content} />
              </div>
            </div>

            {/* <hr /> */}
            <hr className="border-dashed my-1" />

            <div className="flex justify-center md:hidden">{voteComponent}</div>

            {/* comments section */}
            <Suspense
              fallback={<Skeleton className="w-full h-[200px] rounded-md" />}
            >
              <CommentsSection postId={post?.id ?? cachedPost.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
