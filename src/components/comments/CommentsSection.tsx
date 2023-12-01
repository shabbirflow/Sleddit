import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { FC } from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px" />
      <CreateComment postId = {postId}/>
      <div className="flex flex-col gap-y-6 mt-4">
        {comments.map((comment) => {
          const totalVotes = comment.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return (acc += 1);
            if (vote.type === "DOWN") return (acc -= 1);
            return acc;
          }, 0);

          return (
            <div key={comment.id} className="flex flex-col">
              <PostComment comment={comment} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentsSection;
