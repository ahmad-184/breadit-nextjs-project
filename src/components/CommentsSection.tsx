import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getUserSession();

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyTo: null,
    },
    include: {
      replys: {
        include: {
          votes: true,
          user: true,
        },
      },
      votes: true,
      user: true,
    },
  });

  return (
    <div className="flex flex-col gap-2 py-2">
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-4">
        {comments.map((comment) => {
          const commentVotes = comment.votes.reduce((value, vote) => {
            if (vote.type === "UP") return value + 1;
            if (vote.type === "DOWN") return value - 1;
            return value;
          }, 0);

          const currentUserVote = comment.votes.find(
            (v) => v.userId === session?.user.id
          )?.type;

          return (
            <div key={comment.id} className="flex flex-col gap-3">
              <Comment
                comment={comment}
                commentVotes={commentVotes}
                currentUserVote={currentUserVote}
                postId={postId}
              />
              <div className="ml-2 border-l-2 border-zinc-200 pl-4 flex flex-col gap-4">
                {comment.replys.map((reply) => {
                  const replyVotes = reply.votes.reduce((value, vote) => {
                    if (vote.type === "UP") return value + 1;
                    if (vote.type === "DOWN") return value - 1;
                    return value;
                  }, 0);

                  const currentUserReplyVote = reply.votes.find(
                    (v) => v.userId === session?.user.id
                  )?.type;

                  return (
                    <Comment
                      comment={reply}
                      commentVotes={replyVotes}
                      currentUserVote={currentUserReplyVote}
                      postId={postId}
                      key={reply.id + "_comment"}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentsSection;
