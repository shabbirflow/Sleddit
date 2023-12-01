import { Comment, CommentVote, User } from "@prisma/client";
import { FC } from "react";
import UserAvatar from "../ui/UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

interface PostCommentProps {
  comment: Comment & { author: User; votes: CommentVote[] };
}

const PostComment: FC<PostCommentProps> = ({ comment }) => {
  const text = "hey";
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Image
          width="30"
          height="30"
          src={comment.author.image as string}
          alt={"commenter logo"}
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
    </div>
  );
};

export default PostComment;
