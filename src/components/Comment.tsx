"use client";

import {
  Comment as CommentType,
  CommentVote,
  User,
  VoteType,
} from "@prisma/client";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import CommentVoteComponent from "./CommentVote";
import { useState } from "react";
import Icons from "./Icons";
import { Button } from "./ui/Button";
import CreateReplyComment from "./CreateReplyComment";

type ExtendedComment = CommentType & {
  votes: CommentVote[];
  user: User;
};

interface CommentProps {
  comment: ExtendedComment;
  currentUserVote: VoteType | null | undefined;
  commentVotes: number;
  postId: string;
}

const Comment = ({
  comment,
  commentVotes,
  currentUserVote,
  postId,
}: CommentProps) => {
  const [openReply, setOpenReply] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <UserAvatar user={comment.user} className="w-7 h-7" />
        <p className="text-sm text-zinc-800 font-medium">
          u/{comment.user.username}
        </p>
        <p className="text-xs text-zinc-400 font-medium">
          {formatTimeToNow(comment.createdAt)}
        </p>
      </div>

      <p className="text-zinc-800 font-medium text-sm mt-1 mb-1">
        {comment.text}
      </p>

      {/* Comment Vote */}
      <div className="flex gap-1 items-center">
        <CommentVoteComponent
          commentId={comment.id}
          initialCurrentUserVote={currentUserVote}
          initialVotesAmount={commentVotes}
        />
        <Button
          variant="ghost"
          className="p-[5px] h-[2rem] px-2"
          onClick={() => setOpenReply(true)}
        >
          <Icons.comment className="w-4" />
          {/* <p className="text-sm font-medium text-zinc-800">Replay</p> */}
        </Button>
      </div>

      {/* Create Reply */}
      {openReply ? (
        <div className="mt-1">
          <CreateReplyComment
            username={comment.user.username!}
            postId={postId}
            closeReplay={() => setOpenReply(false)}
            replyToId={comment.replyToId ?? comment.id}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Comment;
