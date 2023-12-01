import { Post, User, Vote } from "@prisma/client";
import { FC } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { useRef } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import EditorOutput from "../Editor/EditorOutput";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import PostVoteClient from "../post-vote/PostVoteClient";

interface PostProps {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  currentVote: Vote | undefined;
  voteAmt: number;
  session: Session | null;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  currentVote,
  voteAmt,
  session,
}) => {
  const pRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  return (
    <div className="rounded-md bg-white shadow flex flex-col">
      <div className="flex flex-row">
        {" "}
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={voteAmt}
          initialVote={currentVote?.type}
          userid={session?.user.id}
        />{" "}
        <div className="flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 flex flex-row gap-2">
            {subredditName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>
              Posted by u/{post.author.username}{" "}
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900 m-1">
              {post.title}
            </h1>
          </a>
            <div
              className="relative text-sm max-h-40 w-full overflow-hidden"
              ref={pRef}
            >
              <EditorOutput content={post.content} />
              {pRef.current?.clientHeight === 160 ? (
                // blur bottom if content is too long
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
              ) : null}
            </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6 flex flex-row justify-between">
        <MessageSquare className="h-4 w-4" /> {commentAmt} comments
      </div>
    </div>
  );
};

export default Post;
