"use client";

import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

import { ExtendedPosts } from "@/types/db";
import Post from "./Post";
import { Vote } from "@prisma/client";
import { INFINIT_SCROLLING_PAGINATION_RESULT } from "@/config";
import Icons from "./Icons";
import NoPost from "./NoPost";
import { Skeleton } from "./ui/Skeleton";

interface FeedPostsProps {
  initialPosts: ExtendedPosts[];
  subredditName?: string;
  postsCount: number;
}

const FeedPosts = ({
  initialPosts,
  subredditName,
  postsCount,
}: FeedPostsProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
    rootMargin: "100px",
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["Infinit_Posts"],
      queryFn: async ({ pageParam = 1 }) => {
        const query = `/api/post/get_posts?limit=${
          INFINIT_SCROLLING_PAGINATION_RESULT || "5"
        }&page=${pageParam}${
          subredditName ? `&subredditName=${subredditName}` : null
        }`;

        const { data, status } = await axios.get(query);

        if (status === 200) return data as ExtendedPosts[];
      },
      getNextPageParam: (_, allPages) => {
        if (
          Number(INFINIT_SCROLLING_PAGINATION_RESULT) * allPages.length <
          postsCount
        ) {
          return allPages.length + 1;
        } else return undefined;
      },
      initialData: {
        pageParams: [1],
        pages: [initialPosts],
      },
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.length
    ? data?.pages.flatMap((p) => p)
    : initialPosts;

  return (
    <div className="w-full flex flex-col gap-4">
      {isFetching && !posts.length ? <PostSkeleton /> : null}
      {!isFetching && !posts.length && (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <div className="w-[300px] md:w-[400px]">
            <NoPost className="w-full" />
          </div>
          <p className="text-2xl text-zinc-500 font-semibold text-center">
            ...No posts found...
          </p>
        </div>
      )}
      {posts.length
        ? posts.map((post, index) => {
            const totalVote = post?.votes.reduce((value, currentVote) => {
              if (currentVote.type === "UP") return value + 1;
              if (currentVote.type === "DOWN") return value - 1;
              return value;
            }, 0) as number;

            const currentUserVote = post?.votes.find(
              (p) => p.userId === session?.user.id
            ) as Vote | null | undefined;

            return (
              <div key={index} ref={index + 1 === posts.length ? ref : null}>
                <Post
                  post={post!}
                  totalVote={totalVote || 0}
                  currentUserVote={currentUserVote?.type}
                  subredditName={subredditName as string}
                />
              </div>
            );
          })
        : null}
      {isFetchingNextPage ? (
        <div className="flex items-center justify-center">
          <Icons.loader className="spin-in-4 animate-spin text-zinc-400" />
        </div>
      ) : null}
    </div>
  );
};

const PostSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from([0, 1, 2]).map((i) => (
        <div
          key={i}
          className="w-full flex flex-col gap-1 rounded-lg overflow-y-clip bg-white shadow-md"
        >
          <div className="p-4 flex w-full gap-2 sm:gap-3">
            <div className="flex items-center justify-center">
              <Skeleton className="h-[120px] w-4" />
            </div>
            <div className="flex flex-col gap-2 flex-grow ">
              <Skeleton className="w-3/4 h-3" />
              <Skeleton className="w-[100px] h-4" />
              <Skeleton className="w-full h-[120px]" />
            </div>
          </div>
          <div className="p-4 w-full bg-zinc-100">
            <Skeleton className="w-[70px] h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;
