"use client";

import React, { FC } from "react";
import Link from "next/link";
import type { User } from "next-auth";
import { format } from "date-fns";
import { usePathname } from "next/navigation";

import JoinLeaveCommButton from "./JoinLeaveCommButton";
import { buttonVariants } from "./ui/Button";

interface AboutCommunityProps {
  user: Pick<User, "id">;
  subreddit: {
    name: string;
    createdAt: Date;
    creatorId: string;
    id: string;
  };
  subscribersCount: number;
  isSubscribed: boolean;
}

const AboutCommunity: FC<AboutCommunityProps> = ({
  user,
  subreddit,
  subscribersCount,
  isSubscribed,
}) => {
  const pathname = usePathname();

  const isSubmitPostPage = Boolean(pathname.split("/").includes("submit"));

  return (
    <div
      className={`bg-white overflow-hidden w-full md:w-[200px] lg:w-[300px]
       rounded-lg border border-zinc-300
        ${isSubmitPostPage && "hidden"}
       `}
    >
      <div className="p-3 py-5 bg-zinc-100">
        <p className="font-medium text-sm">
          About{" "}
          <a href={`/r/${subreddit?.name}`} className="underline">
            r/{subreddit?.name}
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full p-3 text-sm col text-zinc-400">
        <div className="w-full flex justify-between">
          <p>Create</p>
          <time dateTime={subreddit?.createdAt.toDateString()}>
            {format(subreddit?.createdAt!, "MMMM d, yyyy")}
          </time>
        </div>
        <hr />
        <div className="w-full flex justify-between">
          <p>Members</p>
          <p>{subscribersCount}</p>
        </div>
        {subreddit?.creatorId === user?.id && isSubscribed ? (
          <>
            <p className="font-semibold text-zinc-500">
              You created this community
            </p>
          </>
        ) : null}
        <div className="flex flex-col gap-2 mt-2">
          {subreddit?.creatorId !== user?.id ? (
            <JoinLeaveCommButton
              isSubscribed={isSubscribed}
              subredditId={subreddit.id}
            />
          ) : null}
          {isSubscribed ? (
            <>
              <Link
                href={`/r/${subreddit.name}/submit`}
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                Create Post
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AboutCommunity;
