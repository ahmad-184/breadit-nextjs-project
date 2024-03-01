import { getUserSession } from "@/lib/nextauth-options";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVoteAmount?: number;
  initialCurrentUserVote?: VoteType;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
  subredditName: string;
}

const PostVoteServer = async ({
  postId,
  initialVoteAmount,
  initialCurrentUserVote,
  getData,
  subredditName,
}: PostVoteServerProps) => {
  const session = await getUserSession();

  let _votesAmt = 0;
  let _currestUserVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();

    if (!post) return notFound();

    _votesAmt = post.votes.reduce((value, p) => {
      if (p.type === "UP") return value + 1;
      if (p.type === "DOWN") return value - 1;
      return value;
    }, 0) as number;

    _currestUserVote = post.votes.find(
      (p) => p.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initialVoteAmount!;
    _currestUserVote = initialCurrentUserVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialCurrentUserVote={_currestUserVote!}
      initialVotesAmount={_votesAmt}
      subredditName={subredditName}
    />
  );
};

export default PostVoteServer;
