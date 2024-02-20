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
        },
      },
      votes: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-2 py-2">
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-3">
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
            <div key={comment.id}>
              <Comment
                comment={comment}
                commentVotes={commentVotes}
                currentUserVote={currentUserVote}
                postId={postId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentsSection;
