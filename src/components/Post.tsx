import { useRef } from "react";

import { formatTimeToNow } from "@/lib/utils";
import { ExtendedPosts } from "@/types/db";
import { VoteType } from "@prisma/client";
import Icons from "./Icons";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";

interface PostProps {
  post: ExtendedPosts;
  totalVote: number;
  currentUserVote: VoteType | null | undefined;
  subredditName: string;
}

const Post = ({ post, totalVote, currentUserVote }: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-lg overflow-y-clip bg-white w-full shadow-md">
      <div className="p-4 flex gap-2 sm:gap-4">
        <PostVoteClient
          postId={post.id}
          initialCurrentUserVote={currentUserVote!}
          initialVotesAmount={totalVote}
        />
        <div className="flex w-[100px] flex-grow flex-col gap-1">
          <div className="w-full">
            <a
              href={`/r/${post.subreddit.name}`}
              className="underline font-medium text-sm text-zinc-800 mr-2"
            >
              r/{post.subreddit.name}
            </a>{" "}
            <span className="text-zinc-500 text-xs font-medium mr-1">
              Posted by u/{post.author.username}
            </span>
            {" - "}
            <span className="text-zinc-500 text-xs font-medium">
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>
          <a
            href={`/r/${post.subreddit.name}/post/${post.id}`}
            className="mb-1"
          >
            <h1 className="font-semibold text-lg text-zinc-900">
              {post.title}
            </h1>
          </a>
          <a
            className="w-full"
            href={`/r/${post.subreddit.name}/post/${post.id}`}
          >
            <div
              className="max-h-[160px] w-full relative overflow-clip mb-2"
              ref={pRef}
            >
              <EditorOutput content={post.content} />

              {pRef.current?.clientHeight === 160 ? (
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              ) : null}
            </div>
          </a>
        </div>
      </div>
      <div className="bg-zinc-50 p-4 w-full">
        <a
          href={`/r/${post.subreddit.name}/post/${post.id}`}
          className="w-fit text-zinc-700 flex items-center text-sm font-medium gap-1"
        >
          <Icons.comment className="w-4" />{" "}
          <span className="text-sm">{post.comments.length} comments</span>
        </a>
      </div>
    </div>
  );
};

export default Post;
